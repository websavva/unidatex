import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { staticDirFullPath } from '@unidatex/static';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: staticDirFullPath,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
