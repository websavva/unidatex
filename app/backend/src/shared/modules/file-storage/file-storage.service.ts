import { Injectable, Inject } from '@nestjs/common';
import mime from 'mime-types';

import {
  ConfigType,
  s3ConfigLoader,
} from '#shared/modules/config/config.module';
import { CryptoService } from '#shared/services/crypto.service';

import { S3_CLIENT_INJECTION_KEY, S3Client } from './s3-client.provider';

@Injectable()
export class FileStorageService {
  constructor(
    @Inject(s3ConfigLoader.KEY)
    private s3Config: ConfigType<typeof s3ConfigLoader>,
    @Inject(S3_CLIENT_INJECTION_KEY)
    private s3Client: S3Client,
    private cryptoService: CryptoService,
  ) {}

  uploadFile(key: string, file: Buffer | Uint8Array | Blob | string) {
    return this.s3Client.putObject({
      Key: key,
      Body: file,
      Bucket: this.s3Config.bucket,
    });
  }

  deleteFile(key: string) {
    return this.s3Client.deleteObject({
      Bucket: this.s3Config.bucket,
      Key: key,
    });
  }

  generateUniqueFilename(mimeType: string) {
    return `${this.cryptoService.generateRandomHash(32)}.${mime.extension(mimeType)}`;
  }
}
