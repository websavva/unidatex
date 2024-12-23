import { z } from 'zod';
import {
  Country,
  Gender,
  LookingFor,
  UserAgeRange,
  UserEmailLengthRange,
  UserNameLengthRange,
  UserLookingForRange,
} from '@unidatex/constants';

import { removeDuplicates } from '../utils';

export const userBirthDate = () =>
  z
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
    );

export const userPassword = () =>
  z
    .string()
    .min(1)
    .max(30)
    .regex(/\d/g, 'At least one digit')
    .regex(/[A-Za-z]/g, 'At least one letter')
    .regex(/[@$!%*?&]/g, 'At least one special symbol (@$!%*?&)');

export const userEmail = () =>
  z
    .string()
    .email()
    .min(UserEmailLengthRange.min)
    .max(UserEmailLengthRange.max);

export const userName = () =>
  z.string().min(UserNameLengthRange.min).max(UserNameLengthRange.max);

export const userGender = () => z.nativeEnum(Gender);

export const userTargetedGender = () => z.nativeEnum(Gender).nullable();

export const userCountry = () => z.nativeEnum(Country);

export const userLookingFor = () =>
  z
    .array(z.nativeEnum(LookingFor))
    .transform(removeDuplicates)
    .pipe(
      z
        .array(z.nativeEnum(LookingFor))
        .min(UserLookingForRange.min)
        .max(UserLookingForRange.max),
    );
