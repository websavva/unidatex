import { postgresConfigLoader } from './postgres.config';
import { redisConfigLoader } from './redis.config';

export * from './postgres.config';
export * from './redis.config';

export const configLoaders = [postgresConfigLoader, redisConfigLoader];
