import {
  jwtConfigLoader,
  ConfigType,
} from '#shared/modules/config/config.module';

export type AuthTokenType = keyof ConfigType<typeof jwtConfigLoader>;

export interface CommonAuthPayload {
  email: string;
}

export interface PasswordResetRequestAuthPayload extends CommonAuthPayload {
  requestId: string;
}
