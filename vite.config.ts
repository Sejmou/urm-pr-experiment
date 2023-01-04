import { resolve } from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

const root = resolve(__dirname, 'src');

const outDir = resolve(__dirname, 'dist');

// https://vitejs.dev/config/
export default defineConfig({
  root,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // https://vitejs.dev/guide/build.html#multi-page-app
        main: resolve(root, 'index.html'),
        tasks: resolve(root, 'tasks/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@lib': resolve(root, 'lib'),
    },
  },
  plugins: [eslint()],
});
