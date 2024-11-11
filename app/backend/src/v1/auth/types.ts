import {
  authSecurityConfigLoader,
  ConfigType,
} from '#shared/modules/config/config.module';

export type AuthTokenType = keyof ConfigType<typeof authSecurityConfigLoader>;

export interface CommonAuthPayload {
  email: string;
}

export interface PasswordResetRequestAuthPayload extends CommonAuthPayload {
  requestId: string;
}
