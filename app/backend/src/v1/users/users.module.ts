import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersRepositoryProvider } from '#shared/repositories/users.repository';
import { FileStorageModule } from '#shared/modules/file-storage/file-storage.module';
import { ConfigModule } from '#shared/modules/config/config.module';
import { UserPhotoEntity, UserProfileView } from '#shared/entities';
import { PaginationService } from '#shared/services/pagination.service';

import { AuthModule } from '../auth/auth.module';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    AuthModule,
    FileStorageModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserPhotoEntity, UserProfileView]),
  ],
  controllers: [UsersController],
  providers: [UsersRepositoryProvider, PaginationService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
