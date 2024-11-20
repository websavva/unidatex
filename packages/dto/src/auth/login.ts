import { z } from 'zod';

import { userPassword, userEmail } from '../user/fields';

export const AuthLoginDtoSchema = z.object({
  email: userEmail(),
  password: userPassword(),
});

export type AuthLoginDto = z.infer<typeof AuthLoginDtoSchema>;
