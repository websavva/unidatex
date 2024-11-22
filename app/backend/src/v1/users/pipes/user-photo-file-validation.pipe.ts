import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  FileTypeValidator,
  ParseFilePipe
} from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class FileSizeValidationPipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        new FileTypeValidator({
          fileType: ''
        })
      ]
    })
  }
}
