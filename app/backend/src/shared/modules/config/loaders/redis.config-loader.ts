import { registerAs } from '@nestjs/config';

export const redisConfigLoader = registerAs('redis', () => ({
  HOST: process.env.REDIS_HOST!,
  PORT: +process.env.REDIS_PORT!,
  PASSWORD: process.env.REDIS_PASSWORD!,
}));
