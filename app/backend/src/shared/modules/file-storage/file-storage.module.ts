import { Module } from '@nestjs/common';

import { CryptoService } from '#shared/services/crypto.service';
import { ConfigModule } from '#shared/modules/config/config.module';

import { S3_CLIENT_FACTORY_PROVIDER } from './s3-client.provider';
import { FileStorageService } from './file-storage.service';

@Module({
  imports: [ConfigModule],

  providers: [CryptoService, S3_CLIENT_FACTORY_PROVIDER, FileStorageService],

  exports: [FileStorageService],
})
export class FileStorageModule {}
