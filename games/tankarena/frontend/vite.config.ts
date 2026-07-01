import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/games/tankarena/' : '/',
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Phaser full build is ~1.6 MB minified; splitting it avoids a false alarm on app code size.
    chunkSizeWarningLimit: 1700,
    rollupOptions: {
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
    port: 3001,
  },
}));
