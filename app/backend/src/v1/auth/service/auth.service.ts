import {
  Injectable,
  BadRequestException,
  Inject,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';

import {
  AuthLoginDto,
  AuthSignUpDto,
  AuthPasswordResetDto,
  AuthPasswordResetConfirmDto,
} from '@unidatex/dto';

import { JwtService } from '#shared/services/jwt.service';
import {
  UsersRepository,
  USERS_REPOSITORY_INJECTION_KEY,
} from '#shared/repositories/users.repository';
import { CACHE_MANAGER, CacheManager } from '#shared/modules/cache.module';
import {
  authSecurityConfigLoader,
  environmentConfigLoader,
  ConfigType,
} from '#shared/modules/config/config.module';
import { CryptoService } from '#shared/services/crypto.service';
import { UserEntity } from '#shared/entities';

import { AuthPayloadWithRequestId, AuthPayload, AuthTokenType } from '../types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authSecurityConfigLoader.KEY)
    private authSecurityConfig: ConfigType<typeof authSecurityConfigLoader>,
    @Inject(environmentConfigLoader.KEY)
    private environmentConfig: ConfigType<typeof environmentConfigLoader>,
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
    private jwtService: JwtService,
    @Inject(USERS_REPOSITORY_INJECTION_KEY)
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  signAuthPayload<P extends AuthPayload>(payload: P, type: AuthTokenType) {
    const {
      [type]: { secret, expiresInSeconds: expiresIn },
    } = this.authSecurityConfig;

    return this.jwtService.sign(payload, secret, {
      expiresIn,
    });
  }

  verifyAuthPayload<P extends AuthPayload = AuthPayload>(
    authToken: string,
    type: AuthTokenType,
  ) {
    const {
      [type]: { secret },
    } = this.authSecurityConfig;

    return this.jwtService.verify<P>(authToken, secret);
  }

  getSignUpRequestKey(email: string) {
    return `sign-up-request-${email}`;
  }

  getSignUpRequest(email: string) {
    const key = this.getSignUpRequestKey(email);

    return this.cacheManager.get<{ user: UserEntity; requestId: string }>(key);
  }

  saveSignUpRequest(newUser: UserEntity, requestId: string) {
    const key = this.getSignUpRequestKey(newUser.email);

    return this.cacheManager.set(
      key,
      { user: newUser, requestId },
      this.authSecurityConfig.signUp.expiresInSeconds * 1e3,
    );
  }

  deleteSignUpRequest(email: string) {
    const key = this.getSignUpRequestKey(email);

    return this.cacheManager.del(key);
  }

  getPasswordResetRequestKey(email: string) {
    return `password-reset-request-${email}`;
  }

  getPasswordResetRequest(email: string) {
    const key = this.getPasswordResetRequestKey(email);

    return this.cacheManager.get<string>(key);
  }

  savePasswordResetRequest(email: string, requestId: string) {
    const key = this.getSignUpRequestKey(email);

    return this.cacheManager.set(
      key,
      requestId,
      this.authSecurityConfig.passwordReset.expiresInSeconds * 1e3,
    );
  }

  deletePasswordResetRequest(email: string) {
    const key = this.getPasswordResetRequestKey(email);

    return this.cacheManager.del(key);
  }

  async createUserFromSingUpDto(signUpDto: AuthSignUpDto) {
    const {
      password,

      ...baseFields
    } = signUpDto;

    const passwordHash = await this.cryptoService.hashifyPassword(password);

    return this.usersRepository.create({
      ...baseFields,
      passwordHash,
    });
  }

  async signUp(signUpDto: AuthSignUpDto) {
    // assertion of user's non-existence
    if (await this.usersRepository.findUserByEmail(signUpDto.email)) {
      throw new BadRequestException('Invalid user data');
    }

    const signUpReguestKey = this.getSignUpRequestKey(signUpDto.email);

    // assertion of uniqueness of sign-up confirmation request
    if (await this.cacheManager.get(signUpReguestKey)) {
      throw new BadRequestException(
        `UserEntity with email "${signUpDto.email}" is created, but has not been verified yet`,
      );
    }

    const newUser = await this.createUserFromSingUpDto(signUpDto);

    const signUpRequestId = this.cryptoService.generateRandomHash(16);

    const AuthPayloadWithRequestId: AuthPayloadWithRequestId = {
      email: newUser.email,
      requestId: signUpRequestId,
    };

    const signUpRequestToken = await this.signAuthPayload(
      AuthPayloadWithRequestId,
      'signUp',
    );

    // TODO: sending sign up confirmation email

    await this.saveSignUpRequest(newUser, signUpRequestId);

    return this.hideFieldsForProduction(
      {
        message:
          'Account has been created. Please confirm your account to be able to sign in',
        token: signUpRequestToken,
      },
      'token',
    );
  }

  async confirmSignUp(token: string) {
    const { email, requestId } =
      await this.verifyAuthPayload<AuthPayloadWithRequestId>(token, 'signUp');

    const signUpRequest = await this.getSignUpRequest(email);

    if (!signUpRequest)
      throw new BadRequestException('No sign-up request was found');

    if (signUpRequest.requestId !== requestId)
      throw new BadRequestException('Invalid sign up request ID');

    await this.deleteSignUpRequest(email);

    const signedUpUser = await this.usersRepository.save(signUpRequest.user);

    return this.hideFieldsForProduction(
      {
        message: 'Account has been verified',
        user: signedUpUser,
      },
      'user',
    );
  }

  async validateAccessToken(accessToken: string) {
    const { email, iat: tokenIssuedAtUnixTimestamp } =
      await this.verifyAuthPayload(accessToken, 'access');

    const user = await this.usersRepository.findUserByEmail(email, true);

    const { passwordUpdatedAt } = user!;

    if (!passwordUpdatedAt) return user;

    const tokenIssuedAt = new Date(tokenIssuedAtUnixTimestamp * 1e3);

    if (+tokenIssuedAt <= +passwordUpdatedAt)
      throw new Error('Token was issued before the last password was updated');

    return user;
  }

  hideFieldsForProduction<
    R extends Record<string, any>,
    F extends keyof R,
    S = R & Partial<Pick<R, F>>,
  >(responseBody: R, fields: F | Array<F>) {
    const { isProd } = this.environmentConfig;

    const formattedFields = Array.isArray(fields) ? fields : [fields];

    return Object.fromEntries(
      Object.entries(responseBody).map(([fieldName, fieldValue]) => {
        const shouldBeHidden = formattedFields.includes(fieldName as F);

        return [fieldName, isProd && shouldBeHidden ? undefined : fieldValue];
      }),
    ) as S;
  }

  async logIn(authLoginDto: AuthLoginDto) {
    const user = await this.usersRepository.findUserByEmail(
      authLoginDto.email,
      false,
    );

    if (!user) throw new BadRequestException('Invalid credentials');

    const isPasswordCorrect = await this.cryptoService
      .comparePasswords(authLoginDto.password, user.passwordHash)
      .catch(() => {
        return false;
      });

    if (!isPasswordCorrect)
      throw new BadRequestException('Invalid credentials');

    const accessToken = await this.signAuthPayload(
      {
        email: authLoginDto.email,
      },
      'access',
    );

    return {
      accessToken,

      user,
    };
  }

  private async ensureUserIsAllowedToResetPassword(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) throw new NotFoundException('UserEntity is not found');

    const { passwordUpdatedAt } = user;

    if (!passwordUpdatedAt) return true;

    const secondsPassedAfterLastPasswordUpdate =
      (Date.now() - +passwordUpdatedAt) / 1e3;

    if (
      secondsPassedAfterLastPasswordUpdate <=
      this.authSecurityConfig.passwordReset.intervalInSeconds
    )
      throw new HttpException(
        'You have recently requested a password reset. Please wait before trying again.',
        HttpStatus.TOO_MANY_REQUESTS,
      );

    return true;
  }

  async requestPasswordReset(passwordResetDto: AuthPasswordResetDto) {
    // checking if the given user exists and interval has passed
    await this.ensureUserIsAllowedToResetPassword(passwordResetDto.email);

    // TODO: checking when the last update of password took place

    const passwordResetRequestId = this.cryptoService.generateRandomHash(16);

    // TODO sending email with the corresponding token
    const passwordResetToken =
      await this.signAuthPayload<AuthPayloadWithRequestId>(
        {
          email: passwordResetDto.email,
          requestId: passwordResetRequestId,
        },
        'passwordReset',
      );

    await this.savePasswordResetRequest(
      passwordResetDto.email,
      passwordResetRequestId,
    );

    return this.hideFieldsForProduction(
      {
        message: 'Password reset instruction has been sent to email address',
        token: passwordResetToken,
      },
      'token',
    );
  }

  async confirmPasswordReset({
    newPassword,
    token,
  }: AuthPasswordResetConfirmDto) {
    const { email, requestId: passwordResetRequestId } =
      await this.verifyAuthPayload<AuthPayloadWithRequestId>(
        token,
        'passwordReset',
      );

    // verifying the request id
    const activePasswordResetRequestId =
      await this.getPasswordResetRequest(email);

    if (!activePasswordResetRequestId)
      throw new NotFoundException('No password reset request was found');

    if (passwordResetRequestId !== activePasswordResetRequestId)
      throw new BadRequestException('Invalid password reset request');

    // checking if the given user exists and interval has passed
    await this.ensureUserIsAllowedToResetPassword(email);

    const user = await this.usersRepository.findUserByEmail(email, true);

    const newPasswordHash =
      await this.cryptoService.hashifyPassword(newPassword);

    user!.passwordHash = newPasswordHash;
    user!.passwordUpdatedAt = new Date();

    await this.usersRepository.save(user!);

    await this.deletePasswordResetRequest(email);

    return this.hideFieldsForProduction(
      {
        user,
        message: 'Password has been reset successfully',
      },
      'user',
    );
  }

  extractAccessTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
