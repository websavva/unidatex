import { fileURLToPath } from 'node:url'
import { join } from 'path'

export const staticDirFullPath = join(fileURLToPath(import.meta.url), 'src')

