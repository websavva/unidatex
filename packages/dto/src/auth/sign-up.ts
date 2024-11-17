import { z } from 'zod';
import { USER_EMAIL_MAX_LENGTH } from '@unidatex/constants';

import { password } from '../validators';

export const AuthSignUpDtoSchema = z.object({
  email: z.string().email().max(USER_EMAIL_MAX_LENGTH),
  password,
});

export type AuthSignUpDto = z.infer<typeof AuthSignUpDtoSchema>;

export const AuthSignUpConfirmDtoSchema = z.object({
  token: z.string(),
});

export type AuthSignUpConfirmDto = z.infer<typeof AuthSignUpConfirmDtoSchema>;
