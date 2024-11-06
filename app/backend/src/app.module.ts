import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { staticDirFullPath } from '@unidatex/static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { allEntities, User } from '#shared/entities';
import { CacheModule } from '#shared/modules/cache.module';
import {
  ConfigModule,
  postgresConfigLoader,
  ConfigType,
} from '#shared/modules/config/config.module';

@Module({
  imports: [
    ConfigModule,
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
    CacheModule,

    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
