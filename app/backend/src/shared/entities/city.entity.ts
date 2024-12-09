import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Country } from '@unidatex/constants';

import { UserEntity } from './user.entity';

@Entity('cities')
export class CityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Country,
    nullable: false,
  })
  country: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  isCapital: boolean;

  @Column({
    type: 'real',
    nullable: false,
  })
  lat: number;

  @Column({
    type: 'real',
    nullable: false,
  })
  lng: number;

  @OneToMany(() => UserEntity, (user) => user.city, {
    lazy: true,
  })
  users: Promise<Relation<UserEntity>>;
}
