import { UserEntity } from './user.entity';
import { UserPhotoEntity } from './user-photo.entity';
import { UserProfileViewEntity } from './user-profile-view.entity';
import { UserFavoriteEntity } from './user-favorite.entity';
import { CityEntity } from './city.entity';

export * from './user.entity';
export * from './user-photo.entity';
export * from './user-profile-view.entity';
export * from './user-favorite.entity';
export * from './user.entity';

export const allEntities = [
  UserEntity,
  UserPhotoEntity,
  UserProfileViewEntity,
  UserFavoriteEntity,
  CityEntity,
];
