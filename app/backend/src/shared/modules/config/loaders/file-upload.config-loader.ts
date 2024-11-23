import { registerAs } from '@nestjs/config';

const deriveMimeTypes = (rawMimeTypes: string) => rawMimeTypes.split(',');

export const fileUploadConfigLoader = registerAs('fileUpload', () => ({
  userPhoto: {
    maxSize: +process.env.UNDX_FILE_UPLOAD_USER_PHOTO_MAX_SIZE_IN_BYTES!,
    mimeTypes: deriveMimeTypes(
      process.env.UNDX_FILE_UPLOAD_USER_PHOTO_MIME_TYPES!,
    ),
  },
}));
