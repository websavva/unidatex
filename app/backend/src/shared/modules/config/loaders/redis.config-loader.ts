import { registerAs } from '@nestjs/config';

export const redisConfigLoader = registerAs('redis', () => ({
  HOST: process.env.UNDX_REDIS_HOST!,
  PORT: +process.env.UNDX_REDIS_PORT!,
  PASSWORD: process.env.UNDX_REDIS_PASSWORD!,
}));
