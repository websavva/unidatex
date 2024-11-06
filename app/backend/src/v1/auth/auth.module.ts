import { Module } from '@nestjs/common';

import { CacheModule } from '#shared/modules/cache.module';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [CacheModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
