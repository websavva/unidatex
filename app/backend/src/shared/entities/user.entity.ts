import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Check,
  OneToMany,
  Relation,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import {
  UserEmailLengthRange,
  UserNameLengthRange,
  UserAgeRange,
  Gender,
  Country,
  EducationLevel,
  LookingFor,
  MaritalStatus,
  UserHeightRange,
  UserWeightRange,
  BodyType,
  Living,
  UncertainBinaryAnswer,
  UserLanguagesRange,
  Language,
  Religion,
  PhysicalLook,
  Occupation,
  Ethnicity,
  EatingHabits,
  DrinkingHabits,
  SmokingHabits,
  UserDescriptionMaxRange,
  UserIntroMaxRange,
} from '@unidatex/constants';

import { UserPhotoEntity } from './user-photo.entity';
import { UserProfileViewEntity } from './user-profile-view.entity';
import { UserFavoriteEntity } from './user-favorite.entity';
import { CityEntity } from './city.entity';
import { ChatEntity } from './chat/chat.entity';
import { MessageEntity } from './chat/message.entity';

@Entity('users')
@Check(
  'birthDate_range',
  `DATE_PART('year', AGE("birthDate")) >= ${UserAgeRange.min} AND DATE_PART('year', AGE("birthDate")) <= ${UserAgeRange.max}`,
)
@Check(
  'height_range',
  `height IS NULL OR (height >= ${UserHeightRange.min} AND height <= ${UserHeightRange.max})`,
)
@Check(
  'weght_range',
  `weight IS NULL OR (weight >= ${UserWeightRange.min} AND weight <= ${UserWeightRange.max})`,
)
@Check(
  'languages_range',
  `array_length(languages, 1) >= ${UserLanguagesRange.min} AND array_length(languages, 1) <= ${UserLanguagesRange.max}`,
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

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  signedUpAt: Date;

  @Column({
    type: 'enum',
    enum: LookingFor,
    array: true,
    nullable: false,
  })
  lookingFor: LookingFor[];

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Male,
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
    type: 'int',
    nullable: true,
  })
  height: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  weight: number | null;

  @Column({
    type: 'enum',
    enum: Country,
    nullable: false,
  })
  country: Country;

  @ManyToOne(() => CityEntity, (city) => city.users, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  city: Relation<CityEntity> | null;

  @Column({
    type: 'enum',
    enum: Occupation,
    nullable: true,
  })
  occupation: Occupation | null;

  @Column({
    type: 'enum',
    enum: Living,
    nullable: true,
  })
  living: Living | null;

  @Column({
    type: 'enum',
    enum: PhysicalLook,
    nullable: true,
  })
  physicalLook: PhysicalLook | null;

  @Column({
    type: 'enum',
    enum: BodyType,
    nullable: true,
  })
  bodyType: BodyType | null;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
    nullable: true,
  })
  maritalStatus: MaritalStatus | null;

  @Column({
    type: 'enum',
    enum: EducationLevel,
    nullable: true,
  })
  educationLevel: EducationLevel | null;

  @Column({
    type: 'enum',
    enum: Religion,
    nullable: true,
  })
  religion: Religion | null;

  @Column({
    type: 'enum',
    enum: Ethnicity,
    nullable: true,
  })
  ethnicity: Ethnicity | null;

  @Column({
    type: 'enum',
    enum: EatingHabits,
    nullable: true,
  })
  eatingHabits: EatingHabits | null;

  @Column({
    type: 'enum',
    enum: DrinkingHabits,
    nullable: true,
  })
  drinkingHabits: DrinkingHabits | null;

  @Column({
    type: 'enum',
    enum: SmokingHabits,
    nullable: true,
  })
  smokingHabits: SmokingHabits | null;

  @Column({
    type: 'enum',
    enum: Language,
    array: true,
    default: [Language.English],
  })
  languages: Language[];

  @Column({
    type: 'boolean',
    nullable: true,
  })
  hasChildren: boolean | null;

  @Column({
    type: 'enum',
    enum: UncertainBinaryAnswer,
    nullable: true,
  })
  wouldTravel: UncertainBinaryAnswer | null;

  @Column({
    type: 'enum',
    enum: UncertainBinaryAnswer,
    nullable: true,
  })
  wouldRelocate: UncertainBinaryAnswer | null;

  @Column({
    type: 'varchar',
    nullable: true,
    length: UserIntroMaxRange.max,
  })
  intro: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    length: UserDescriptionMaxRange.max,
  })
  description: string | null;

  @OneToMany(() => UserPhotoEntity, (userPhoto) => userPhoto.user, {
    eager: true,
    orphanedRowAction: 'disable',
  })
  photos: Relation<UserPhotoEntity[]>;

  @OneToMany(
    () => UserProfileViewEntity,
    (userProfileView) => userProfileView.viewer,
    {
      lazy: true,
    },
  )
  outcomingViews: Promise<Relation<UserProfileViewEntity>[]>;

  @OneToMany(
    () => UserProfileViewEntity,
    (userProfileView) => userProfileView.viewedUser,
    {
      lazy: true,
    },
  )
  incomingViews: Promise<Relation<UserProfileViewEntity>[]>;

  @OneToMany(() => UserFavoriteEntity, (userFavorite) => userFavorite.user, {
    lazy: true,
  })
  favoritedUsers: Promise<Relation<UserFavoriteEntity>[]>;

  @OneToMany(
    () => UserFavoriteEntity,
    (userFavorite) => userFavorite.favoritedUser,
    {
      lazy: true,
    },
  )
  favoritedByUsers: Promise<Relation<UserFavoriteEntity>[]>;

  @OneToMany(() => ChatEntity, (chat) => chat.masterParticipant, {
    lazy: true,
  })
  masterChats: Promise<Relation<ChatEntity>[]>;

  @OneToMany(() => ChatEntity, (chat) => chat.subParticipant, {
    lazy: true,
  })
  subChats: Promise<Relation<ChatEntity>[]>;

  @OneToMany(() => MessageEntity, (message) => message.sender, {
    lazy: true,
  })
  sentMessages: Promise<Relation<MessageEntity>[]>;
}
