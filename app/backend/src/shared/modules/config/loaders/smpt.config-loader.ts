import { registerAs } from '@nestjs/config';

export const smtpConfigLoader = registerAs('smtp', () => ({
  host: process.env.SMTP_HOST!,
  port: +process.env.SMTP_PORT!,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  from: process.env.SMTP_FROM!,
  sender: process.env.SMTP_SENDER!,
}));
