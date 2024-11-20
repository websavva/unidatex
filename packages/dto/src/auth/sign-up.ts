import { z } from 'zod';
import {
  Country,
  Gender,
  UserAgeRange,
  UserEmailLengthRange,
  UserNameLengthRange,
} from '@unidatex/constants';

import { password } from '../validators';

export const AuthSignUpDtoSchema = z.object({
  email: z
    .string()
    .email()
    .min(UserEmailLengthRange.min)
    .max(UserEmailLengthRange.max),
  name: z.string().min(UserNameLengthRange.min).max(UserEmailLengthRange.max),
  password: password(),

  gender: z.nativeEnum(Gender),
  targetedGender: z.nativeEnum(Gender).nullable(),
  country: z.nativeEnum(Country),
  birthDate: z
    .string()
    .datetime()
    .pipe(
      z.coerce
        .date()
        .transform((date) => {
          const normalizedDate = new Date(+date);

          normalizedDate.setHours(0, 0, 0, 0);

          return normalizedDate;
        })
        .refine((birthDate) => {
          const currentDate = new Date();

          let age = currentDate.getFullYear() - birthDate.getFullYear();

          if (
            currentDate.getMonth() < birthDate.getMonth() ||
            (currentDate.getMonth() === birthDate.getMonth() &&
              currentDate.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          return age >= UserAgeRange.min && age <= UserAgeRange.max;
        }, `Age should be between ${UserAgeRange.min} and ${UserAgeRange.max} years old`),
    ),
});

export type AuthSignUpDto = z.infer<typeof AuthSignUpDtoSchema>;

export const AuthSignUpConfirmDtoSchema = z.object({
  token: z.string(),
});

export type AuthSignUpConfirmDto = z.infer<typeof AuthSignUpConfirmDtoSchema>;
