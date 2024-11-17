import { Column, Entity, PrimaryGeneratedColumn, Check } from 'typeorm';
import {
  UserEmailLengthRange,
  UserNameLengthRange,
  UserAgeRange,
  Gender,
  Country,
} from '@unidatex/constants';

@Entity()
@Check(
  `DATE_PART('year', AGE("birthDate")) >= ${UserAgeRange.min} AND DATE_PART('year', AGE("birthDate")) <= ${UserAgeRange.max}`,
)
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: UserEmailLengthRange.max,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: UserNameLengthRange.max,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  passwordHash: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  passwordUpdatedAt: Date | null;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  targetedGender: Gender | null;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: Country,
    nullable: false,
  })
  country: Country;
}
