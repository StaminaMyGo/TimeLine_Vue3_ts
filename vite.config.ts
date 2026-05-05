import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/TimeLine_Vue3_ts/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: ['pwa-icon.svg'],

      manifest: {
        name: 'TimeLine App',
        short_name: 'TimeLine',
        start_url: '/TimeLine_Vue3_ts/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/TimeLine_Vue3_ts/pwa-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/TimeLine_Vue3_ts/pwa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },

      workbox: {
        // 关键：避免 HTML 被缓存导致版本错乱
        navigateFallback: null,

        // 强制新 SW 生效
        skipWaiting: true,
        clientsClaim: true,

        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst'
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style',
            handler: 'StaleWhileRevalidate'
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    sourcemap: false
  }
})