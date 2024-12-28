import { UserEntity } from './user.entity';
import { UserPhotoEntity } from './user-photo.entity';
import { UserProfileViewEntity } from './user-profile-view.entity';
import { UserFavoriteEntity } from './user-favorite.entity';
import { CityEntity } from './city.entity';
import { ChatEntity } from './chat/chat.entity';
import { MessageEntity } from './chat/message.entity';

export * from './user.entity';
export * from './user-photo.entity';
export * from './user-profile-view.entity';
export * from './user-favorite.entity';
export * from './user.entity';
export * from './chat/chat.entity';
export * from './chat/message.entity';

export const allEntities = [
  UserEntity,
  UserPhotoEntity,
  UserProfileViewEntity,
  UserFavoriteEntity,
  CityEntity,
  ChatEntity,
  MessageEntity,
];
