import { version } from './package.json';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  preview: {
    host: '0.0.0.0',
    port: 10086,
  },
  plugins: [VitePWA({ registerType: 'autoUpdate' })],
  publicDir: './src/assets',
  build: {
    outDir: 'dist/',
    assetsInlineLimit: 10240,
    emptyOutDir: true,
  },
  define: {
    BUILD_TIME: JSON.stringify(new Date().toLocaleString()),
    BUILD_VERSION: JSON.stringify(version),
  },
});
