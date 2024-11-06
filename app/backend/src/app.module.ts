import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { staticDirFullPath } from '@unidatex/static';

import { allEntities } from '#shared/entities';
import {
  ConfigModule,
  postgresConfigLoader,
  ConfigType,
} from '#shared/modules/config/config.module';

import { V1Module } from './v1/v1.module';

@Module({
  imports: [
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

    V1Module,
  ],
})
export class AppModule {}
