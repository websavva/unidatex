import { z } from 'zod';

export const AuthSignUpConfirmDtoSchema = z.object({
  token: z.string(),
});

export type AuthSignUpConfirmDto = z.infer<typeof AuthSignUpConfirmDtoSchema>;
