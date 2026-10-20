import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// The iOS app reuses the web app's client code from ../app (single source of truth).
// Only the server API routes are replaced by an in-app fetch shim (src/api-shim.ts).
const here = path.dirname(fileURLToPath(import.meta.url));
const webApp = path.resolve(here, '../app');
const local = (pkg: string) => path.resolve(here, 'node_modules', pkg);

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${webApp}/` },
      // Shared sources live outside this package; force their bare imports to resolve here.
      { find: /^tailwindcss$/, replacement: local('tailwindcss') },
    ],
    dedupe: ['react', 'react-dom', 'lucide-react'],
  },
  server: { fs: { allow: [here, webApp] } },
  build: { outDir: 'dist', emptyOutDir: true, target: 'safari15' },
});
