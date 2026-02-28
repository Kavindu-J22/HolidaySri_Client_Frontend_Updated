import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    hmr: {
      port: 3000,
    },
    proxy: {
      '/api': {
        target: 'https://holidaysri-backend-9xm4.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
