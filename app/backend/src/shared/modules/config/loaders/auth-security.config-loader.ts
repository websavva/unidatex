import { registerAs } from '@nestjs/config';

export const authSecurityConfigLoader = registerAs('authSecurity', () => ({
  signUp: {
    secret: process.env.AUTH_JWT_SIGN_UP_REQUEST_TOKEN_SECRET!,
    expiresInSeconds:
      +process.env.AUTH_JWT_SIGN_UP_REQUEST_TOKEN_EXPIRES_IN_SECONDS!,
  },

  access: {
    secret: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET!,
    expiresInSeconds: +process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS!,
  },

  passwordReset: {
    secret: process.env.AUTH_JWT_PASSWORD_RESET_REQUEST_TOKEN_SECRET!,
    expiresInSeconds:
      +process.env.AUTH_JWT_PASSWORD_RESET_REQUEST_TOKEN_EXPIRES_IN_SECONDS!,
    intervalInSeconds:
      +process.env.AUTH_PASSWORD_RESET_REQUEST_INTERVAL_IN_SECONDS!,
  },
}));
