import { Module } from '@nestjs/common';
import { ConfigModule as CoreConfigModule } from '@nestjs/config';

import { configLoaders } from './loaders';

@Module({
  imports: [
    CoreConfigModule.forRoot({
      load: configLoaders,
    }),
  ],

  exports: [CoreConfigModule],
})
export class ConfigModule {}

export * from './loaders';
export { ConfigType } from '@nestjs/config';
