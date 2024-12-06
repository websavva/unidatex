import { registerAs } from '@nestjs/config';

export const redisConfigLoader = registerAs('redis', () => ({
  host: process.env.UNDX_REDIS_HOST!,
  port: +process.env.UNDX_REDIS_PORT!,
  password: process.env.UNDX_REDIS_PASSWORD!,
}));
