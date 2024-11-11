import { z } from 'zod';

import { password } from '../validators';

export const AuthSignUpDtoSchema = z.object({
  email: z.string().email(),
  password,
});

export type AuthSignUpDto = z.infer<typeof AuthSignUpDtoSchema>;

export const AuthSignUpConfirmDtoSchema = z.object({
  token: z.string(),
});

export type AuthSignUpConfirmDto = z.infer<typeof AuthSignUpConfirmDtoSchema>;
