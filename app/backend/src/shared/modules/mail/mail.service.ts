import { Inject, Injectable } from '@nestjs/common';
import { SendMailOptions } from 'nodemailer';
import {
  renderEmailTemplate,
  EmailTemplateName,
  EmailTemplateProps,
} from '@unidatex/email-templates';

import {
  ConfigType,
  smtpConfigLoader,
} from '#shared/modules/config/config.module';

import { TRANSPORTER_INJECTION_KEY, Transporter } from './transporter.provider';

export interface SendEmailOptions<T extends EmailTemplateName>
  extends Required<Pick<SendMailOptions, 'to' | 'subject'>> {
  props: EmailTemplateProps[T];
}

@Injectable()
export class MailService {
  constructor(
    @Inject(TRANSPORTER_INJECTION_KEY) private transporter: Transporter,
    @Inject(smtpConfigLoader.KEY)
    private smptOptions: ConfigType<typeof smtpConfigLoader>,
  ) {}

  public async sendEmail<T extends EmailTemplateName>(
    name: T,
    { to, subject, props }: SendEmailOptions<T>,
  ) {
    const { html, text } = await renderEmailTemplate(name, props);

    const { from, sender } = this.smptOptions;

    return this.transporter.sendMail({
      from,
      sender,
      to,
      subject,
      html,
      text,
    });
  }
}
