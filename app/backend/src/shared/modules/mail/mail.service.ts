import { Inject, Injectable } from '@nestjs/common';
import { SendMailOptions } from 'nodemailer';

import {
  ConfigType,
  smtpConfigLoader,
} from '#shared/modules/config/config.module';

import { TRANSPORTER_INJECTION_KEY, Transporter } from './transporter.provider';

interface SendEmailOptions
  extends Required<Pick<SendMailOptions, 'to' | 'subject' | 'text' | 'html'>> {}

@Injectable()
export class MailService {
  constructor(
    @Inject(TRANSPORTER_INJECTION_KEY) private transporter: Transporter,
    @Inject(smtpConfigLoader.KEY)
    private smptOptions: ConfigType<typeof smtpConfigLoader>,
  ) {}

  public sendEmail(options: SendEmailOptions) {
    const { from, sender } = this.smptOptions;

    return this.transporter.sendMail({
      from,
      sender,
      ...options,
    });
  }
}
