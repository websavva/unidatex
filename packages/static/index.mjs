import { fileURLToPath } from 'node:url';
import { join, dirname } from 'path';

export const staticDirFullPath = join(
  dirname(fileURLToPath(import.meta.url)),
  'src',
);
