import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: 'build',
    sourcemap: process.env.GENERATE_SOURCEMAP === 'true',
    emptyOutDir: true,
    rollupOptions: {
      input: ['./src/index', './index.html']
    },
  },
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
  },
  resolve: {
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
}
);