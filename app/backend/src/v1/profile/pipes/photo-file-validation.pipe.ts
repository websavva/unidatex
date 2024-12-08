import { Inject, Injectable } from '@nestjs/common';

import {
  ConfigType,
  fileUploadConfigLoader,
} from '#shared/modules/config/config.module';

import { FileValidationPipe } from '#shared/pipes/file-validation.pipe';

@Injectable()
export class ProfilePhotoFileValidation extends FileValidationPipe {
  constructor(
    @Inject(fileUploadConfigLoader.KEY)
    fileUploadConfig: ConfigType<typeof fileUploadConfigLoader>,
  ) {
    const {
      userPhoto: { maxSize, mimeTypes },
    } = fileUploadConfig;

    super({
      maxSize,
      mimeTypes,
    });
  }
}
