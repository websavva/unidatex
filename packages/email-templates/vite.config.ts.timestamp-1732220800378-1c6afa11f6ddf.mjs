// vite.config.ts
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "file:///Users/websavva/coding/self/projects/unidatex/node_modules/.pnpm/vite@5.4.11_@types+node@20.17.3_terser@5.36.0/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/websavva/coding/self/projects/unidatex/node_modules/.pnpm/@vitejs+plugin-vue@5.2.0_vite@5.4.11_@types+node@20.17.3_terser@5.36.0__vue@3.5.12_typescript@5.6.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///Users/websavva/coding/self/projects/unidatex/node_modules/.pnpm/vite-plugin-dts@4.3.0_@types+node@20.17.3_rollup@4.26.0_typescript@5.6.3_vite@5.4.11_@types+node@20.17.3_terser@5.36.0_/node_modules/vite-plugin-dts/dist/index.mjs";
import { staticDirFullPath } from "file:///Users/websavva/coding/self/projects/unidatex/packages/static/index.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/websavva/coding/self/projects/unidatex/packages/email-templates/vite.config.ts";
var vite_config_default = defineConfig(({ command }) => {
  const currentDirname = dirname(fileURLToPath(__vite_injected_original_import_meta_url));
  const isBuild = command === "build";
  const plugins = [vue()];
  if (isBuild)
    plugins.push(
      dts({
        tsconfigPath: "./tsconfig.app.json",
        include: ["./src"],
        insertTypesEntry: true
      })
    );
  return {
    plugins,
    publicDir: isBuild ? "public" : staticDirFullPath,
    resolve: {
      alias: {
        "@": join(currentDirname, "src")
      }
    },
    envPrefix: "UNDX_",
    build: {
      lib: {
        entry: join(currentDirname, "src/index.ts"),
        name: "EmailTemplates",
        fileName: "index"
      },
      rollupOptions: {
        external: ["@vue-email/render", "@vue-email/component", "vue"]
      }
    },
    server: {
      port: 3e3
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2Vic2F2dmEvY29kaW5nL3NlbGYvcHJvamVjdHMvdW5pZGF0ZXgvcGFja2FnZXMvZW1haWwtdGVtcGxhdGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2Vic2F2dmEvY29kaW5nL3NlbGYvcHJvamVjdHMvdW5pZGF0ZXgvcGFja2FnZXMvZW1haWwtdGVtcGxhdGVzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93ZWJzYXZ2YS9jb2Rpbmcvc2VsZi9wcm9qZWN0cy91bmlkYXRleC9wYWNrYWdlcy9lbWFpbC10ZW1wbGF0ZXMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkaXJuYW1lLCBqb2luIH0gZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnO1xuXG5pbXBvcnQgeyBzdGF0aWNEaXJGdWxsUGF0aCB9IGZyb20gJ0B1bmlkYXRleC9zdGF0aWMnO1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kIH0pID0+IHtcbiAgY29uc3QgY3VycmVudERpcm5hbWUgPSBkaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSk7XG5cbiAgY29uc3QgaXNCdWlsZCA9IGNvbW1hbmQgPT09ICdidWlsZCc7XG5cbiAgY29uc3QgcGx1Z2lucyA9IFt2dWUoKV07XG5cbiAgaWYgKGlzQnVpbGQpXG4gICAgcGx1Z2lucy5wdXNoKFxuICAgICAgZHRzKHtcbiAgICAgICAgdHNjb25maWdQYXRoOiAnLi90c2NvbmZpZy5hcHAuanNvbicsXG4gICAgICAgIGluY2x1ZGU6IFsnLi9zcmMnXSxcbiAgICAgICAgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zLFxuXG4gICAgcHVibGljRGlyOiBpc0J1aWxkID8gJ3B1YmxpYycgOiBzdGF0aWNEaXJGdWxsUGF0aCxcblxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogam9pbihjdXJyZW50RGlybmFtZSwgJ3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgZW52UHJlZml4OiAnVU5EWF8nLFxuXG4gICAgYnVpbGQ6IHtcbiAgICAgIGxpYjoge1xuICAgICAgICBlbnRyeTogam9pbihjdXJyZW50RGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgICBuYW1lOiAnRW1haWxUZW1wbGF0ZXMnLFxuICAgICAgICBmaWxlTmFtZTogJ2luZGV4JyxcbiAgICAgIH0sXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIGV4dGVybmFsOiBbJ0B2dWUtZW1haWwvcmVuZGVyJywgJ0B2dWUtZW1haWwvY29tcG9uZW50JywgJ3Z1ZSddLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiAzMDAwLFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1ksU0FBUyxTQUFTLFlBQVk7QUFDbGEsU0FBUyxxQkFBcUI7QUFFOUIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sU0FBUztBQUVoQixTQUFTLHlCQUF5QjtBQVBrTixJQUFNLDJDQUEyQztBQVVyUyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFFBQVEsTUFBTTtBQUMzQyxRQUFNLGlCQUFpQixRQUFRLGNBQWMsd0NBQWUsQ0FBQztBQUU3RCxRQUFNLFVBQVUsWUFBWTtBQUU1QixRQUFNLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFFdEIsTUFBSTtBQUNGLFlBQVE7QUFBQSxNQUNOLElBQUk7QUFBQSxRQUNGLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxPQUFPO0FBQUEsUUFDakIsa0JBQWtCO0FBQUEsTUFDcEIsQ0FBQztBQUFBLElBQ0g7QUFFRixTQUFPO0FBQUEsSUFDTDtBQUFBLElBRUEsV0FBVyxVQUFVLFdBQVc7QUFBQSxJQUVoQyxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssZ0JBQWdCLEtBQUs7QUFBQSxNQUNqQztBQUFBLElBQ0Y7QUFBQSxJQUVBLFdBQVc7QUFBQSxJQUVYLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxRQUNILE9BQU8sS0FBSyxnQkFBZ0IsY0FBYztBQUFBLFFBQzFDLE1BQU07QUFBQSxRQUNOLFVBQVU7QUFBQSxNQUNaO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDYixVQUFVLENBQUMscUJBQXFCLHdCQUF3QixLQUFLO0FBQUEsTUFDL0Q7QUFBQSxJQUNGO0FBQUEsSUFFQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
