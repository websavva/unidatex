import { registerAs } from '@nestjs/config';

export const smtpConfigLoader = registerAs('smtp', () => ({
  host: process.env.UNDX_SMTP_HOST!,
  port: +process.env.UNDX_SMTP_PORT!,
  user: process.env.UNDX_SMTP_USER,
  password: process.env.UNDX_SMTP_PASSWORD,
  from: process.env.UNDX_SMTP_FROM!,
  sender: process.env.UNDX_SMTP_SENDER!,
}));
