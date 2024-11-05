import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

import { staticDirFullPath } from '@unidatex/static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  configLoaders,
  postgresConfigLoader,
  redisConfigLoader,
} from './config';
import { allEntities } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configLoaders,
    }),
    ServeStaticModule.forRoot({
      rootPath: staticDirFullPath,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: (postgresConfig: ConfigType<typeof postgresConfigLoader>) => {
        const {
          HOST: host,
          PORT: port,
          PASSWORD: password,
          USER: username,
          DB: database,
        } = postgresConfig;

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          synchronize: true,
          entities: allEntities,
        };
      },

      inject: [postgresConfigLoader.KEY],
    }),

    TypeOrmModule.forFeature(allEntities),

    CacheModule.registerAsync({
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

      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
