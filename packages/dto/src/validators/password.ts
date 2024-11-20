import { z } from 'zod';

export const password = () => z
  .string()
  .min(1)
  .max(30)
  .regex(/\d/g, 'At least one digit')
  .regex(/[A-Za-z]/g, 'At least one letter')
  .regex(/[@$!%*?&]/g, 'At least one special symbol (@$!%*?&)');
