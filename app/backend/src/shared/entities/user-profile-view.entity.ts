import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Relation,
} from 'typeorm';

import { UserEntity } from './user.entity';

@Entity()
export class UserProfileView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.incomingViews, {
    eager: true,
  })
  viewedUser: Relation<UserEntity>;

  @ManyToOne(() => UserEntity, (user) => user.outcomingViews, {
    eager: true,
  })
  viewer: Relation<UserEntity>;

  @CreateDateColumn()
  viewedAt: Date;
}
