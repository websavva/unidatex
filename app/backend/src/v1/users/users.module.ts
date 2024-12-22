import { Module } from '@nestjs/common';

import { UsersRepositoryProvider } from '#shared/repositories/users.repository';
import { PaginationService } from '#shared/services/pagination.service';

import { AuthModule } from '../auth/auth.module';
import { ProfileModule } from '../profile/profile.module';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [AuthModule, ProfileModule],
  controllers: [UsersController],
  providers: [UsersRepositoryProvider, UsersService, PaginationService],
  exports: [UsersService],
})
export class UsersModule {}
