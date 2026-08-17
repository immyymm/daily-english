import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/').at(-1);

export default defineConfig({
  base: process.env.GITHUB_ACTIONS && repositoryName ? '/' + repositoryName + '/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: '每日英语',
        short_name: '每日英语',
        description: '每天五个单词，温柔而有节奏地把词汇变成表达。',
        lang: 'zh-CN',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#fff8fb',
        theme_color: '#f7b8cb',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,ico,json,woff2}'],
        navigateFallbackDenylist: [/^\/api\//]
      }
    })
  ]
});
