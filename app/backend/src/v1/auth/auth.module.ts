import { Module } from '@nestjs/common';

import { CacheModule } from '#shared/modules/cache.module';
import { UsersModule } from '#shared/modules/users/users.module';
import { CryptoService } from '#shared/services/crypto.service';
import { JwtService } from '#shared/services/jwt.service';
import { ConfigModule } from '#shared/modules/config/config.module';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [ConfigModule, CacheModule, UsersModule],
  controllers: [AuthController],
  providers: [CryptoService, JwtService, AuthService],
})
export class AuthModule {}
