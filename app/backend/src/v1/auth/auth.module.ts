import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheModule } from '#shared/modules/cache.module';
import { CryptoService } from '#shared/services/crypto.service';
import { JwtService } from '#shared/services/jwt.service';
import { ConfigModule } from '#shared/modules/config/config.module';
import { UsersRepositoryProvider } from '#shared/repositories/users.repository';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    // TypeOrmModule.forFeature([UsersRepository]),
  ],
  controllers: [AuthController],
  providers: [CryptoService, JwtService, AuthService, UsersRepositoryProvider],
  exports: [AuthService],
})
export class AuthModule {}
