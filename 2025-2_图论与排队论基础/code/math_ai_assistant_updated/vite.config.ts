import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/coze-up': {
        target: 'https://api.coze.cn',
        changeOrigin: true,
        timeout: 120000,
        proxyTimeout: 120000,
        rewrite: (path) => path.replace(/^\/api\/coze-up/, ''),
      },
      '/api/coze-stream': {
        target: 'https://9vr2hrvydc.coze.site',
        changeOrigin: true,
        timeout: 300000,
        proxyTimeout: 300000,
        rewrite: (path) => path.replace(/^\/api\/coze-stream/, ''),
      },
    },
  },
});
