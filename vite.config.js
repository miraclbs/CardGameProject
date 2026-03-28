import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/openai': {
        target: 'https://api.openai.com/v1/chat/completions',
        changeOrigin: true,
        rewrite: (path) => '',
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const apiKey = process.env.VITE_OPENAI_API_KEY;
            if (apiKey) {
              proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
            }
          });
        }
      }
    }
  }
})
