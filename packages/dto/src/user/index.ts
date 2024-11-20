import { z } from 'zod';
import {
  EducationLevel,
  MaritalStatus,
  UserHeightRange,
  UserWeightRange,
  BodyType,
  Living,
  UncertainBinaryAnswer,
  UserLanguagesRange,
  Language,
  Religion,
  PhysicalLook,
  Occupation,
  Ethnicity,
  EatingHabits,
  DrinkingHabits,
  SmokingHabits,
  UserDescriptionMaxRange,
  UserIntroMaxRange,
} from '@unidatex/constants';

import { AuthSignUpDtoSchema } from '../auth';

export const UserUpdateDtoSchema = AuthSignUpDtoSchema.omit({
  email: true,
  password: true,
})
  .extend({
    height: z.number().int().gte(UserHeightRange.min).lte(UserHeightRange.max),
    weight: z.number().int().gte(UserWeightRange.min).lte(UserWeightRange.max),

    intro: z.string().max(UserIntroMaxRange.max).nullable(),
    description: z.string().max(UserDescriptionMaxRange.max).nullable(),

    occupation: z.nativeEnum(Occupation).nullable(),
    maritalStatus: z.nativeEnum(MaritalStatus).nullable(),
    educationLevel: z.nativeEnum(EducationLevel).nullable(),
    living: z.nativeEnum(Living).nullable(),
    hasChildren: z.boolean().nullable(),

    physicalLook: z.nativeEnum(PhysicalLook).nullable(),
    bodyType: z.nativeEnum(BodyType).nullable(),

    ethnicity: z.nativeEnum(Ethnicity).nullable(),
    religion: z.nativeEnum(Religion).nullable(),
    languages: z
      .array(z.nativeEnum(Language))
      .min(UserLanguagesRange.min)
      .max(UserLanguagesRange.max),

    eatingHabits: z.nativeEnum(EatingHabits).nullable(),
    drinkingHabits: z.nativeEnum(DrinkingHabits).nullable(),

    smokingHabits: z.nativeEnum(SmokingHabits).nullable(),
    wouldTravel: z.nativeEnum(UncertainBinaryAnswer).nullable(),
    wouldRelocate: z.nativeEnum(UncertainBinaryAnswer).nullable(),
  })
  .partial()
  .refine((userUpdateDto) => Object.keys(userUpdateDto).length > 0, {
    path: ['User'],
    message: 'At least one field must be specified',
  });

export type UserUpdateDto = z.infer<typeof UserUpdateDtoSchema>;
