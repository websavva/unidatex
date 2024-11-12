import {
  authSecurityConfigLoader,
  ConfigType,
} from '#shared/modules/config/config.module';

export type AuthTokenType = keyof ConfigType<typeof authSecurityConfigLoader>;

export interface AuthPayload {
  email: string;
}

export interface AuthPayloadWithRequestId extends AuthPayload {
  requestId: string;
}
