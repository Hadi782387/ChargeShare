import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ChargeShare', short_name: 'ChargeShare', description: 'EV rescue network',
        theme_color: '#4545D6', background_color: '#F4F0FF', display: 'standalone', start_url: '/',
        icons: [] // TODO: add 192/512 png icons in /public
      }
    })
  ]
})
