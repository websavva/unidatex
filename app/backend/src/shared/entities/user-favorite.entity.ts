import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Relation,
} from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('user_favorites')
export class UserFavoriteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.favoritedUsers, {
    onDelete: 'CASCADE',
  })
  user: Relation<UserEntity>;

  @ManyToOne(() => UserEntity, (user) => user.favoritedByUsers, {
    onDelete: 'CASCADE',
  })
  favoritedUser: Relation<UserEntity>;

  @CreateDateColumn()
  createdAt: Date;
}
