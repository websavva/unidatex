import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { USER_EMAIL_MAX_LENGTH } from '@unidatex/constants';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: USER_EMAIL_MAX_LENGTH,
    nullable: false,
    unique: true,
  })
  email: string;

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
}
