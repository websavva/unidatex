import type { ValidationRange } from './types';

export const UserEmailLengthRange: ValidationRange = {
  min: 1,
  max: 200,
};

export const UserNameLengthRange: ValidationRange = {
  min: 1,
  max: 30,
};

export const UserAgeRange: ValidationRange = {
  min: 18,
  max: 100,
};

export const UserHeightRange: ValidationRange = {
  min: 120,
  max: 220,
};

export const UserWeightRange: ValidationRange = {
  min: 25,
  max: 250,
}
