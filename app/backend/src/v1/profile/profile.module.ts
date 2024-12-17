import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { UsersRepositoryProvider } from '#shared/repositories/users.repository';
import { FileStorageModule } from '#shared/modules/file-storage/file-storage.module';
import { ConfigModule } from '#shared/modules/config/config.module';
import {
  UserPhotoEntity,
  UserProfileViewEntity,
  UserFavoriteEntity,
} from '#shared/entities';
import { PaginationService } from '#shared/services/pagination.service';

import { GeoModule } from '../geo/geo.module';
import { AuthModule } from '../auth/auth.module';

import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => UsersModule),
    GeoModule,
    FileStorageModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      UserPhotoEntity,
      UserProfileViewEntity,
      UserFavoriteEntity,
    ]),
  ],
  controllers: [ProfileController],
  providers: [UsersRepositoryProvider, PaginationService, ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
