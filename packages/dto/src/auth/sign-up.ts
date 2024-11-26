import { z } from 'zod';

import {
  userEmail,
  userPassword,
  userName,
  userGender,
  userTargetedGender,
  userCountry,
  userBirthDate,
  userLookingFor,
} from '../user/fields';

export const AuthSignUpDtoSchema = z.object({
  email: userEmail(),
  name: userName(),
  password: userPassword(),

  gender: userGender(),
  targetedGender: userTargetedGender(),
  country: userCountry(),
  birthDate: userBirthDate(),
  lookingFor: userLookingFor(),
});

export type AuthSignUpDto = z.infer<typeof AuthSignUpDtoSchema>;

export const AuthSignUpConfirmDtoSchema = z.object({
  token: z.string(),
});

export type AuthSignUpConfirmDto = z.infer<typeof AuthSignUpConfirmDtoSchema>;
