import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsx: 'automatic',
  },
  define: {
    global: 'window',
  },
  server: {
    port: 5173,
    host: true,
  },
});
