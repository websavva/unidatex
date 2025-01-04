import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { ChatsController } from './controllers/chats.controller';
import { ChatsService } from './services/chats.service';

@Module({
  imports: [AuthModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
