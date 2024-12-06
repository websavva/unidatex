import { registerAs } from '@nestjs/config';

export const postgresConfigLoader = registerAs('postgres', () => ({
  host: process.env.UNDX_POSTGRES_HOST!,
  port: +process.env.UNDX_POSTGRES_PORT!,
  user: process.env.UNDX_POSTGRES_USER!,
  password: process.env.UNDX_POSTGRES_PASSWORD!,
  db: process.env.UNDX_POSTGRES_DB!,
}));
