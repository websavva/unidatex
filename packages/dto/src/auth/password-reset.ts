import { z, ZodIssueCode } from 'zod';

import { userEmail, userPassword } from '../user/fields';

export const AuthPasswordResetDtoSchema = z.object({
  email: userEmail(),
});

export type AuthPasswordResetDto = z.infer<typeof AuthPasswordResetDtoSchema>;

export const AuthPasswordResetConfirmDtoSchema = z
  .object({
    token: z.string(),
    newPassword: userPassword(),
    confirmNewPassword: userPassword(),
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
