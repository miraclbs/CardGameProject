import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // API key'i env'den al ve header'a ekle
            const apiKey = process.env.VITE_DEEPSEEK_API_KEY;
            if (apiKey) {
              proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
            }
          });
        }
      }
    }
  }
})
