import { z } from 'zod';

export const removeDuplicates = <T extends Array<any>>(items: T) => {
  return Array.from(new Set(items)) as T;
};

export const numericStringOrNumber = () =>
  z
    .string()
    .regex(/^\d+$/, {
      message: 'Should be numeric',
    })
    .or(z.number());
