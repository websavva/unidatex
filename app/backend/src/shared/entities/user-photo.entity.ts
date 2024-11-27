import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
  AfterLoad,
  AfterUpdate,
  AfterInsert,
} from 'typeorm';

import { s3ConfigLoader } from '#shared/modules/config/loaders';

import { UserEntity } from './user.entity';

@Entity()
export class UserPhotoEntity {
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

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isPrimary: boolean;

  url: string;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  generateUrl() {
    this.url = s3ConfigLoader().createUrl(this.key);
  }
}
