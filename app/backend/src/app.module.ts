import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { staticDirFullPath } from '@unidatex/static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configLoaders, loadDatabaseConfig } from './config';
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

      useFactory: (databaseConfig: ConfigType<typeof loadDatabaseConfig>) => {
        const {
          HOST: host,
          PORT: port,
          PASSWORD: password,
          USER: username,
          DB: database,
        } = databaseConfig;

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

      inject: [loadDatabaseConfig.KEY],
    }),

    TypeOrmModule.forFeature(allEntities),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
