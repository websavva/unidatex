import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 200,
    default: '',
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
