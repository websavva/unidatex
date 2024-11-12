import { registerAs } from '@nestjs/config';

export const environmentConfigLoader = registerAs('environment', () => {
  const nodeEnv = process.env.NODE_ENV;

  return {
    nodeEnv,

    isDev: nodeEnv === 'development',
    isProd: nodeEnv === 'production',
    isTest: nodeEnv === 'isTest',
  };
});
