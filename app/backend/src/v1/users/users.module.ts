import { Module } from '@nestjs/common';

import { UsersRepositoryProvider } from '#shared/repositories/users.repository';

import { AuthModule } from '../auth/auth.module';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersRepositoryProvider, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
