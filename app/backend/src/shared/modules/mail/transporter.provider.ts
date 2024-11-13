import { FactoryProvider } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import {
  ConfigType,
  smtpConfigLoader,
  environmentConfigLoader,
} from '#shared/modules/config/config.module';

export const TRANSPORTER_INJECTION_KEY = 'smtp-transporter';

export { Transporter };

export const TransporterProvider: FactoryProvider<Transporter> = {
  provide: TRANSPORTER_INJECTION_KEY,
  inject: [smtpConfigLoader.KEY, environmentConfigLoader.KEY],
  useFactory: async (
    { host, port, user, password }: ConfigType<typeof smtpConfigLoader>,
    { isDev }: ConfigType<typeof environmentConfigLoader>,
  ) => {
    const authOptions = !isDev
      ? {
          user,
          pass: password,
        }
      : undefined;

    const transporter = createTransport({
      port,
      host,
      auth: authOptions,
      secure: !isDev,
    });

    await transporter.verify();

    return transporter;
  },
};
