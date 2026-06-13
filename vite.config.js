import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // icons live in public/icons and are copied as-is; include the
      // apple-touch icon so it ends up in the build output too.
      includeAssets: ['icons/apple-touch-icon-180.png'],
      manifest: {
        name: 'GenFit OnSite',
        short_name: 'GenFit',
        description: 'In-home personal training where life actually happens.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0c0c0d',
        theme_color: '#0c0c0d',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
