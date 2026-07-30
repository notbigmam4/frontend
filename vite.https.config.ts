import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 4174,
    strictPort: true,
    https: {
      cert: readFileSync(resolve('.cert/dev-cert.pem')),
      key: readFileSync(resolve('.cert/dev-key.pem')),
    },
  },
});
