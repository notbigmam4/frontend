import { VitePWA } from 'vite-plugin-pwa'

export const pwaPlugin = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: [
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'app_logo.webp',
    'pwa-192x192.png',
    'pwa-512x512.png',
  ],
  manifest: {
    name: 'Førerkort',
    short_name: 'Førerkort',
    description: 'Førerkort',
    theme_color: '#f87808',
    background_color: '#f87808',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/',
    scope: '/',
    lang: 'nb',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
    navigateFallback: '/index.html',
    cleanupOutdatedCaches: true,
  },
})
