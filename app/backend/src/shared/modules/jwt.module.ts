import { Module } from '@nestjs/common';
import { JwtModule as CoreJwtModule } from '@nestjs/jwt';

import {
  ConfigModule,
  jwtConfigLoader,
  ConfigType,
} from './config/config.module';

@Module({
  imports: [
    CoreJwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (jwtConfig: ConfigType<typeof jwtConfigLoader>) => {
        return {
          secret: jwtConfig.SECRET,
        };
      },

      inject: [jwtConfigLoader.KEY],
    }),
  ],
  exports: [CoreJwtModule],
})
export class JwtModule {}

export { JwtService } from '@nestjs/jwt';
