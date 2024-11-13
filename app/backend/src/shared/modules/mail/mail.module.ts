import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';

import { TransporterProvider } from './transporter.provider';
import { MailService } from './mail.service';
@Module({
  imports: [ConfigModule],
  providers: [TransporterProvider, MailService],
  exports: [MailService],
})
export class MailModule {}
