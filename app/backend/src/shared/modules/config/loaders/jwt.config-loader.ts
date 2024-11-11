import { registerAs } from '@nestjs/config';

export const jwtConfigLoader = registerAs('jwt', () => ({
  signUp: {
    secret: process.env.JWT_SIGN_UP_REQUEST_TOKEN_SECRET!,
    expiresInSeconds:
      +process.env.JWT_SIGN_UP_REQUEST_TOKEN_EXPIRES_IN_SECONDS!,
  },

  access: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
    expiresInSeconds: +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS!,
  },

  passwordReset: {
    secret: process.env.JWT_PASSWORD_RESET_REQUEST_TOKEN_SECRET!,
    expiresInSeconds:
      +process.env.JWT_PASSWORD_RESET_REQUEST_TOKEN_EXPIRES_IN_SECONDS!,
  },
}));
