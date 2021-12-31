import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: path.join(__dirname, 'src', 'renderer'),
  publicDir: path.join(__dirname, 'public'),
  build: {
    outDir: path.join(__dirname, 'dist', 'renderer')
  },
  plugins: [vue()]
});
