import {
  Injectable,
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';

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
  jwtConfigLoader,
  ConfigType,
} from '#shared/modules/config/config.module';
import { CryptoService } from '#shared/services/crypto.service';
import { User } from '#shared/entities';

import {
  CommonAuthPayload,
  AuthTokenType,
  PasswordResetRequestAuthPayload,
} from '../types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfigLoader.KEY)
    private jwtConfig: ConfigType<typeof jwtConfigLoader>,
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
    private jwtService: JwtService,
    private usersService: UsersService,
    private cryptoService: CryptoService,
  ) {}

  signAuthPayload<P extends Record<string, any> = CommonAuthPayload>(
    payload: P,
    type: AuthTokenType,
  ) {
    const {
      [type]: { secret, expiresInSeconds: expiresIn },
    } = this.jwtConfig;

    return this.jwtService.sign(payload, secret, {
      expiresIn,
    });
  }

  verifyAuthPayload<P extends Record<string, any> = CommonAuthPayload>(
    authToken: string,
    type: AuthTokenType,
  ) {
    const {
      [type]: { secret },
    } = this.jwtConfig;

    return this.jwtService.verify<P>(authToken, secret);
  }

  getSignUpRequestKey(email: string) {
    return `sign-up-request-${email}`;
  }

  getSignUpRequest(email: string) {
    const key = this.getSignUpRequestKey(email);

    return this.cacheManager.get<User>(key);
  }

  saveSignUpRequest(newUser: User) {
    const key = this.getSignUpRequestKey(newUser.email);

    return this.cacheManager.set(
      key,
      newUser,
      this.jwtConfig.signUp.expiresInSeconds * 1e3,
    );
  }

  deleteSignUpRequest(email: string) {
    const key = this.getSignUpRequestKey(email);

    return this.cacheManager.del(key);
  }

  getPasswordResetRequestKey(email: string) {
    return `sign-up-request-${email}`;
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
      this.jwtConfig.passwordReset.expiresInSeconds * 1e3,
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

    const signUpRequestToken = await this.signAuthPayload(
      {
        email: newUser.email,
      },
      'signUp',
    );
    // TODO: sending sign up confirmation email
    const signUpRequestConfirmationUrl = new URL(
      'auth/sign-up/confirm',
      'http://localhost:3000',
    );

    signUpRequestConfirmationUrl.searchParams.set('token', signUpRequestToken);

    await this.saveSignUpRequest(newUser);

    return {
      signUpRequestConfirmationUrl,
    };
  }

  async confirmSignUp(token: string) {
    const { email } = await this.verifyAuthPayload(token, 'signUp');

    const userToBeConfirmed = await this.getSignUpRequest(email);

    if (!userToBeConfirmed)
      throw new BadRequestException('No sign-up request was found');

    await this.deleteSignUpRequest(email);

    return this.usersService.usersRepository.save(userToBeConfirmed);
  }

  async validateAccessToken(accessToken: string) {
    const { email } = await this.verifyAuthPayload(accessToken, 'access');

    return this.usersService.findUserByEmail(email, true);
  }

  async logIn(authLoginDto: AuthLoginDto) {
    const user = await this.usersService.findUserByEmail(
      authLoginDto.email,
      false,
    );

    if (!user)
      throw new NotFoundException(
        `User with the given email "${authLoginDto.email}" was not found`,
      );

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

  async requestPasswordReset(passwordResetDto: AuthPasswordResetDto) {
    // checking if the given user exists
    if (!(await this.usersService.findUserByEmail(passwordResetDto.email)))
      throw new NotFoundException('User is not found');

    // TODO: checking when the last update of password took place

    const passwordResetRequestId = this.cryptoService.generateRandomHash(16);

    // TODO sending email with the corresponding token
    const passwordResetToken =
      await this.signAuthPayload<PasswordResetRequestAuthPayload>(
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
      await this.verifyAuthPayload<PasswordResetRequestAuthPayload>(
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

    const user = await this.usersService.findUserByEmail(email);

    if (!user) throw new NotFoundException('User is not found');

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
}
