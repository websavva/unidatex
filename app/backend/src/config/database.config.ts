import { registerAs } from '@nestjs/config';

export const loadDatabaseConfig = registerAs('database', () => ({
  HOST: process.env.POSTGRES_HOST!,
  PORT: +process.env.POSTGRES_PORT!,
  USER: process.env.POSTGRES_USER!,
  PASSWORD: process.env.POSTGRES_PASSWORD!,
  DB: process.env.POSTGRES_DB!,
}));
