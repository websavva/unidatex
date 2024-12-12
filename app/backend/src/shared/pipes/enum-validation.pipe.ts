import { z } from 'zod';

import { ZodValidationPipe } from './zod-validation.pipe';

export class EnumZodValidationPipe extends ZodValidationPipe {
  constructor(enumLike: z.EnumLike, paramName = 'type') {
    super(z.nativeEnum(enumLike), {
      path: {
        enabled: true,
        type: 'zodPathArray',
        transform: () => paramName,
      },

      code: {
        enabled: false,
      },

      message: {
        enabled: true,
        label: '',
      },
    });
  }
}
