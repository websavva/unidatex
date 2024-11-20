import { z, ZodIssueCode } from 'zod';

import { password } from '../validators';

export const AuthPasswordResetDtoSchema = z.object({
  email: z.string().email(),
});

export type AuthPasswordResetDto = z.infer<typeof AuthPasswordResetDtoSchema>;

export const AuthPasswordResetConfirmDtoSchema = z
  .object({
    token: z.string(),
    newPassword: password(),
    confirmNewPassword: password(),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ['confirmNewPassword'],
        message: 'Passwords should match',
        fatal: true,
      });
    }
  });

export type AuthPasswordResetConfirmDto = z.infer<
  typeof AuthPasswordResetConfirmDtoSchema
>;
