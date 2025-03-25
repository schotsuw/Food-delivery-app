import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API requests to your backend during development
      '/api': {
        target: 'http://localhost:8080', // API Gateway address
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
