import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

import { staticDirFullPath } from '@unidatex/static';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const currentDirname = dirname(fileURLToPath(import.meta.url));

  const isBuild = command === 'build';

  const plugins = [vue()];

  if (isBuild)
    plugins.push(
      dts({
        tsconfigPath: './tsconfig.app.json',
        include: ['./src'],
        insertTypesEntry: true,
      }),
    );

  return {
    plugins,

    publicDir: isBuild ? 'public' : staticDirFullPath,

    resolve: {
      alias: {
        '@': join(currentDirname, 'src'),
      },
    },

    build: {
      lib: {
        entry: join(currentDirname, 'src/index.ts'),
        name: 'EmailTemplates',
        fileName: 'index',
      },
      rollupOptions: {
        external: ['@vue-email/render', '@vue-email/component', 'vue'],
      },
    },
  };
});
