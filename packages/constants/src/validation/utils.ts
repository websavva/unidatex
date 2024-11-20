import type {
  MaxValidationRange,
  MinValidationRange,
  FullValidationRange,
} from './types';

export const createFullValidationRange = (
  min: number,
  max: number,
): FullValidationRange => ({
  min,
  max,
});

export const createMinValidationRange = (min: number): MinValidationRange => ({
  min,
});

export const createMaxValidationRange = (max: number): MaxValidationRange => ({
  max,
});
