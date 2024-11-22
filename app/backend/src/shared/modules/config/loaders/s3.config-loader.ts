import { join } from 'node:path';

import { registerAs } from '@nestjs/config';

export const s3ConfigLoader = registerAs('s3', () => {
  const baseConfig = {
    endpoint: process.env.UNDX_S3_ENDPOINT!,
    accessKey: process.env.UNDX_S3_ACCESS_KEY!,
    secretKey: process.env.UNDX_S3_SECRET_KEY!,
    region: process.env.UNDX_S3_REGION!,
    bucket: process.env.UNDX_S3_BUCKET!,
  };

  const createUrl = (key: string) => {
    return new URL(join(baseConfig.bucket, key), baseConfig.endpoint);
  };

  return {
    ...baseConfig,
    createUrl,
  };
});
