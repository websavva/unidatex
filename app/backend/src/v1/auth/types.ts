import {
  jwtConfigLoader,
  ConfigType,
} from '#shared/modules/config/config.module';

export type AuthTokenType = keyof ConfigType<typeof jwtConfigLoader>;

export interface AuthPayload {
  email: string;
}
