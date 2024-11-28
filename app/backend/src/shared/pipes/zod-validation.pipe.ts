import { PipeTransform, BadRequestException } from '@nestjs/common';

import { ZodSchema, ZodError } from 'zod';
import { ErrorMessageOptions, generateErrorMessage } from 'zod-error';

const defaultZodErrorOptions: ErrorMessageOptions = {
  maxErrors: 1,
  code: {
    enabled: false,
  },

  message: {
    enabled: true,
    label: '',
  },

  path: {
    type: 'breadcrumbs',
    label: null,
    enabled: true,
  },

  transform: ({ errorMessage }) => errorMessage,
};

export class ZodValidationPipe implements PipeTransform {
  constructor(
    private schema: ZodSchema,
    private zodErrorOptions: ErrorMessageOptions = defaultZodErrorOptions,
  ) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      let errorMessage: string;

      if (error instanceof ZodError) {
        errorMessage = generateErrorMessage(error.issues, this.zodErrorOptions);
      } else {
        errorMessage = 'Validation failed';
      }

      throw new BadRequestException(errorMessage);
    }
  }
}
