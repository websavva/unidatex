import { registerAs } from '@nestjs/config';

export const jwtConfigLoader = registerAs('jwt', () => ({
  SECRET: process.env.JWT_SECRET,
  SIGN_UP_CONFIRMATION_TOKEN_EXPIRES_IN_SECONDS:
    +process.env.JWT_SIGN_UP_CONFIRMATION_EXPIRES_IN_SECONDS,
  AUTH_TOKEN_EXPIRES_IN_SECONDS: +process.env.JWT_AUTH_TOKEN_EXPIRES_IN_SECONDS,
}));
