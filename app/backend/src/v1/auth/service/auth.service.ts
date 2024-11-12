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
import { UsersService } from '#shared/modules/users/users.module';
import { CACHE_MANAGER, CacheManager } from '#shared/modules/cache.module';
import {
  authSecurityConfigLoader,
  ConfigType,
} from '#shared/modules/config/config.module';
import { CryptoService } from '#shared/services/crypto.service';
import { User } from '#shared/entities';

import { AuthPayloadWithRequestId, AuthPayload, AuthTokenType } from '../types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authSecurityConfigLoader.KEY)
    private authSecurityConfig: ConfigType<typeof authSecurityConfigLoader>,
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
    private jwtService: JwtService,
    private usersService: UsersService,
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

    return this.cacheManager.get<{ user: User; requestId: string }>(key);
  }

  saveSignUpRequest(newUser: User, requestId: string) {
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

    return this.usersService.usersRepository.create({
      ...baseFields,
      passwordHash,
    });
  }

  async signUp(signUpDto: AuthSignUpDto) {
    // assertion of user's non-existence
    if (await this.usersService.findUserByEmail(signUpDto.email)) {
      throw new BadRequestException('Invalid user data');
    }

    const signUpReguestKey = this.getSignUpRequestKey(signUpDto.email);

    // assertion of uniqueness of sign-up confirmation request
    if (await this.cacheManager.get(signUpReguestKey)) {
      throw new BadRequestException(
        `User with email "${signUpDto.email}" is created, but has not been verified yet`,
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

    return {
      requestId: signUpRequestId,
      signUpRequestToken,
    };
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

    return this.usersService.usersRepository.save(signUpRequest.user);
  }

  async validateAccessToken(accessToken: string) {
    const { email, iat: tokenIssuedAtUnixTimestamp } =
      await this.verifyAuthPayload(accessToken, 'access');

    const user = await this.usersService.findUserByEmail(email, true);

    const { passwordUpdatedAt } = user;

    if (!passwordUpdatedAt) return user;

    const tokenIssuedAt = new Date(tokenIssuedAtUnixTimestamp * 1e3);

    if (+tokenIssuedAt <= +passwordUpdatedAt)
      throw new Error('Token was issued before the last password was updated');

    return user;
  }

  async logIn(authLoginDto: AuthLoginDto) {
    const user = await this.usersService.findUserByEmail(
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
    const user = await this.usersService.findUserByEmail(email);

    if (!user) throw new NotFoundException('User is not found');

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

    return {
      passwordResetRequestId,
      passwordResetToken,
    };
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

    const user = await this.usersService.findUserByEmail(email, true);

    const newPasswordHash =
      await this.cryptoService.hashifyPassword(newPassword);

    user.passwordHash = newPasswordHash;
    user.passwordUpdatedAt = new Date();

    await this.usersService.usersRepository.save(user);

    await this.deletePasswordResetRequest(email);

    return {
      user,
    };
  }

  extractAccessTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
