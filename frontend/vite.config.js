// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [react(), UnoCSS()],

  server: {
    host: '0.0.0.0', // Allow access from any IP on the network
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://172.16.223.198:8000', // Use your network IP for backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})


