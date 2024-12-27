import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  Relation,
  OneToMany,
} from 'typeorm';

import { UserEntity } from '../user.entity';
import { MessageEntity } from './message.entity';

@Entity()
@Unique(['participant1', 'participant2']) // Ensure uniqueness for the user pair
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.masterChats, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  masterParticipant: Relation<UserEntity>;

  @ManyToOne(() => UserEntity, (user) => user.subChats, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  subParticipant: Relation<UserEntity>;

  @OneToMany(() => MessageEntity, (message) => message.chat, {
    nullable: false,
    onDelete: 'CASCADE',
    lazy: true,
  })
  messages: Promise<Relation<MessageEntity>[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
