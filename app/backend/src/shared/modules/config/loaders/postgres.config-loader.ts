import { registerAs } from '@nestjs/config';

export const postgresConfigLoader = registerAs('postgres', () => ({
  HOST: process.env.UNDX_POSTGRES_HOST!,
  PORT: +process.env.UNDX_POSTGRES_PORT!,
  USER: process.env.UNDX_POSTGRES_USER!,
  PASSWORD: process.env.UNDX_POSTGRES_PASSWORD!,
  DB: process.env.UNDX_POSTGRES_DB!,
}));
