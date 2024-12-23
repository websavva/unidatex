import { z, type EnumLike } from 'zod';

import { userCountry, userTargetedGender, userGender } from './fields';

import {
  EducationLevel,
  MaritalStatus,
  UserAgeRange,
  UserHeightRange,
  UserWeightRange,
  BodyType,
  Living,
  UncertainBinaryAnswer,
  Language,
  Religion,
  PhysicalLook,
  Occupation,
  Ethnicity,
  EatingHabits,
  DrinkingHabits,
  SmokingHabits,
  UserNameLengthRange,
  type FullValidationRange,
} from '@unidatex/constants';

import { removeDuplicates, numericStringOrNumber } from '../utils';

const nativeEnumList = <T extends EnumLike>(enumLike: T) =>
  z
    .array(z.nativeEnum(enumLike))
    .transform(removeDuplicates)
    .pipe(
      z
        .array(z.nativeEnum(enumLike))
        .min(1)
        .max(Object.values(enumLike).length),
    );

const usersSearchRange = <PropName extends string>(
  propName: PropName,
  range: FullValidationRange,
) => {
  const capitalizedPropName = propName[0].toUpperCase() + propName.slice(1);

  const minPropName =
    `min${capitalizedPropName}` as `min${Capitalize<PropName>}`;
  const maxPropName =
    `max${capitalizedPropName}` as `max${Capitalize<PropName>}`;

  const r = numericStringOrNumber()
    .default(1)
    .pipe(z.coerce.number().int().finite().min(range.min).max(range.max));

  const fieldsConfig = Object.fromEntries(
    [
      [minPropName, range.min],
      [maxPropName, range.max],
    ].map(([fieldName, limit]) => [
      fieldName,
      numericStringOrNumber()
        .default(limit)
        .pipe(z.coerce.number().int().finite().min(range.min).max(range.max)),
    ]),
  ) as Record<
    typeof minPropName | typeof maxPropName,
    z.ZodPipeline<
      z.ZodDefault<z.ZodUnion<[z.ZodString, z.ZodNumber]>>,
      z.ZodNumber
    >
  >;

  return z.object(fieldsConfig);
};

export const UsersSearchParamsDtoSchema = z
  .object({
    country: userCountry(),
    gender: userGender(),
    targetedGender: userTargetedGender().default(null),

    occupation: nativeEnumList(Occupation),
    maritalStatus: nativeEnumList(MaritalStatus),
    educationLevel: nativeEnumList(EducationLevel),
    living: nativeEnumList(Living),
    hasChildren: z.boolean(),

    physicalLook: nativeEnumList(PhysicalLook),
    bodyType: nativeEnumList(BodyType),

    ethnicity: nativeEnumList(Ethnicity),
    religion: nativeEnumList(Religion),
    languages: nativeEnumList(Language),

    eatingHabits: nativeEnumList(EatingHabits),
    drinkingHabits: nativeEnumList(DrinkingHabits),

    smokingHabits: nativeEnumList(SmokingHabits),
    wouldTravel: nativeEnumList(UncertainBinaryAnswer),
    wouldRelocate: nativeEnumList(UncertainBinaryAnswer),

    city: z.string().uuid(),

    name: z.string().min(UserNameLengthRange.min).max(UserNameLengthRange.max),
  })
  .merge(usersSearchRange('age', UserAgeRange))
  .merge(usersSearchRange('height', UserHeightRange))
  .merge(usersSearchRange('weight', UserWeightRange))
  .partial();
