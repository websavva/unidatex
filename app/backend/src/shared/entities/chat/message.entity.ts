import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Unique,
  Relation,
  Column,
} from 'typeorm';

import { UserEntity } from '../user.entity';
import { ChatEntity } from './chat.entity';

@Entity()
@Unique(['participant1', 'participant2']) // Ensure uniqueness for the user pair
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.sentMessages, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  sender: Relation<UserEntity>;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages, {
    lazy: true,
    nullable: false,
  })
  chat: Relation<ChatEntity>;

  @Column({
    type: 'varchar',
    length: 20e3,
  })
  text: string;

  @Column({
    type: 'timestamp with time zone',
  })
  birthDate: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  readAt: Date | null;

  @CreateDateColumn()
  sentAt: Date;
}
