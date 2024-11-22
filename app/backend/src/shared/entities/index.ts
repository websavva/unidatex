import { UserEntity } from './user.entity';
import { UserPhotoEntity } from './user-photo.entity';

export * from './user.entity';
export * from './user-photo.entity';

export const allEntities = [UserEntity, UserPhotoEntity];
