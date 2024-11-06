import { postgresConfigLoader } from './postgres.config-loader';
import { redisConfigLoader } from './redis.config-loader';

export * from './postgres.config-loader';
export * from './redis.config-loader';

export const configLoaders = [postgresConfigLoader, redisConfigLoader];
