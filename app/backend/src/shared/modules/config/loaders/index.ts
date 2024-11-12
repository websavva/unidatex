import { postgresConfigLoader } from './postgres.config-loader';
import { redisConfigLoader } from './redis.config-loader';
import { authSecurityConfigLoader } from './auth-security.config-loader';
import { environmentConfigLoader } from './environment.config-loader';

export * from './postgres.config-loader';
export * from './redis.config-loader';
export * from './auth-security.config-loader';
export * from './environment.config-loader';

export const configLoaders = [
  postgresConfigLoader,
  redisConfigLoader,
  authSecurityConfigLoader,
  environmentConfigLoader,
];
