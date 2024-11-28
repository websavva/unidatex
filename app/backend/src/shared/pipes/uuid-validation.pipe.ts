import { z } from 'zod';

import { ZodValidationPipe } from './zod-validation.pipe';

export class UUIDZodValidationPipe extends ZodValidationPipe {
  constructor(paramName = 'id') {
    super(z.string().uuid(), {
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
