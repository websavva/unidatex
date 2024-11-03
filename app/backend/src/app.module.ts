import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { staticDirFullPath } from '@unidatex/static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configLoaders } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configLoaders,
    }),
    ServeStaticModule.forRoot({
      rootPath: staticDirFullPath,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
