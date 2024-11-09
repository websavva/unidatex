import { Module } from '@nestjs/common';
import {
  CacheModule as CoreCacheModule,
  CacheStore,
} from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

import {
  ConfigModule,
  ConfigType,
  redisConfigLoader,
} from './config/config.module';

@Module({
  imports: [
    CoreCacheModule.registerAsync({
      imports: [ConfigModule],

      useFactory: async (redisConfig: ConfigType<typeof redisConfigLoader>) => {
        const { PASSWORD, PORT, HOST } = redisConfig;

        const store = (await redisStore({
          socket: {
            host: HOST,
            port: PORT,
          },

          password: PASSWORD,
        })) as unknown as CacheStore;

        return {
          store,
        };
      },

      inject: [redisConfigLoader.KEY],
    }),
  ],

  exports: [CoreCacheModule],
})
export class CacheModule {}

export { CACHE_MANAGER, Cache as CacheManager } from '@nestjs/cache-manager';
