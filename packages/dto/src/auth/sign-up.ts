import { z } from 'zod';

import { password } from '../validators';

export const AuthSignUpDtoSchema = z.object({
  email: z.string().email(),
  password,
});

export type AuthSignUpDto = z.infer<typeof AuthSignUpDtoSchema>;
