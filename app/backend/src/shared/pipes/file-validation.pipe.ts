import {
  FileTypeValidator,
  ParseFilePipe,
  FileValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';

export interface FileValidationOptions {
  mimeTypes?: string[];
  maxSize?: number;
}

export class FileValidationPipe extends ParseFilePipe {
  constructor(private options: FileValidationOptions) {
    const validators: FileValidator[] = [];

    super({
      validators: validators,
    });

    if (this.options.mimeTypes?.length) {
      validators.push(
        new FileTypeValidator({
          fileType: new RegExp(this.options.mimeTypes.join('|')),
        }),
      );
    }

    if (this.options.maxSize) {
      validators.push(
        new MaxFileSizeValidator({
          maxSize: this.options.maxSize,
        }),
      );
    }
  }
}
