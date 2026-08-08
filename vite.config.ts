import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pwaPlugin } from './pwa.config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pwaPlugin],
  base: '/',
})
