import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',

    // Force Vite to use localhost:5173
    port: 5173,

    // Stop auto switching to 5174/5175
    strictPort: true,

    proxy: {
      '/api': {
        target: 'http://localhost:5180',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})