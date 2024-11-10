import {
  Injectable,
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';

import { AuthLoginDto, AuthSignUpDto } from '@unidatex/dto';

import { JwtService } from '#shared/services/jwt.service';
import { UsersService } from '#shared/modules/users/users.module';
import { CACHE_MANAGER, CacheManager } from '#shared/modules/cache.module';
import {
  jwtConfigLoader,
  ConfigType,
} from '#shared/modules/config/config.module';
import { CryptoService } from '#shared/services/crypto.service';
import { User } from '#shared/entities';

import { AuthPayload, AuthTokenType } from '../types';

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

  signAuthPayload(payload: AuthPayload, type: AuthTokenType) {
    const {
      [type]: { secret, expiresInSeconds: expiresIn },
    } = this.jwtConfig;

    return this.jwtService.sign(payload, secret, {
      expiresIn,
    });
  }

  verifyAuthPayload(authToken: string, type: AuthTokenType) {
    const {
      [type]: { secret },
    } = this.jwtConfig;

    return this.jwtService.verify<AuthPayload>(authToken, secret);
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
}
