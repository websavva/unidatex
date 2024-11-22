import { Module } from '@nestjs/common';

import { UsersRepositoryProvider } from '#shared/repositories/users.repository';
import { FileStorageModule } from '#shared/modules/file-storage/file-storage.module';

import { AuthModule } from '../auth/auth.module';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [AuthModule, FileStorageModule],
  controllers: [UsersController],
  providers: [UsersRepositoryProvider, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
