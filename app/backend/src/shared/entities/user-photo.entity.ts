import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
} from 'typeorm';

import { s3ConfigLoader } from '#shared/modules/config/loaders';
import { UserEntity } from './user.entity';

@Entity()
export class UserPhotoEntity {
  private s3Config = s3ConfigLoader();

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  key: string;

  @ManyToOne(() => UserEntity, (user) => user.photos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  user: Relation<UserEntity>;

  get url() {
    return this.s3Config.createUrl(this.key);
  }
}
