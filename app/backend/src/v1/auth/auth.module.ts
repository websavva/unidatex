import { Module } from '@nestjs/common';

import { CacheModule } from '#shared/modules/cache.module';
import { JwtModule } from '#shared/modules/jwt.module';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [CacheModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
