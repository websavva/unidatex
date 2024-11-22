import { FactoryProvider, ParseFilePipe } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';

import {
  ConfigType,
  s3ConfigLoader,
} from '#shared/modules/config/config.module';

export const S3_CLIENT_INJECTION_KEY = 's3-client';

export const S3_CLIENT_FACTORY_PROVIDER: FactoryProvider<S3> = {
  provide: S3_CLIENT_INJECTION_KEY,
  inject: [s3ConfigLoader.KEY],
  useFactory: async ({
    endpoint,
    accessKey,
    secretKey,
    bucket,
    region,
  }: ConfigType<typeof s3ConfigLoader>) => {
    const s3 = new S3({
      endpoint,
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },

      forcePathStyle: true,
    });

    const allBuckets = await s3.listBuckets();

    if (!allBuckets.Buckets?.find(({ Name }) => Name === bucket)) {
      await s3.createBucket({
        Bucket: bucket,
        ACL: 'public-read',
      });
    }

    return s3;
  },
};

export type S3Client = S3;
