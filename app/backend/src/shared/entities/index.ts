import { UserEntity } from './user.entity';
import { UserPhotoEntity } from './user-photo.entity';
import { UserProfileView } from './user-profile-view.entity';

export * from './user.entity';
export * from './user-photo.entity';
export * from './user-profile-view.entity';

export const allEntities = [UserEntity, UserPhotoEntity, UserProfileView];
