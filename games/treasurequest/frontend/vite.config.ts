import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/games/treasurequest/' : '/',
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1700,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/phaser')) {
            return 'phaser';
          }
          if (id.includes('node_modules/protobufjs')) {
            return 'protobuf';
          }
        },
      },
    },
  },
  server: {
    port: 3002,
  },
}));
