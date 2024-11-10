import { z } from 'zod';

import { password } from '../validators';

export const AuthLoginDtoSchema = z.object({
  email: z.string().email(),
  password,
});

export type AuthLoginDto = z.infer<typeof AuthLoginDtoSchema>;
