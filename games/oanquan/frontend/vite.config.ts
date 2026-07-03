import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/games/oanquan/' : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          if (id.includes('node_modules/react')) {
            return 'react';
          }
          if (id.includes('node_modules/protobufjs')) {
            return 'protobuf';
          }
        },
      },
    },
  },
  server: {
    port: 3003,
  },
}));
