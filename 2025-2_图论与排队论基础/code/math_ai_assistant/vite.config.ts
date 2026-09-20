import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      '/api/coze-stream': {
        target: 'https://9vr2hrvydc.coze.site',
        changeOrigin: true,
        timeout: 600000,
        proxyTimeout: 600000,
        rewrite: (path) => path.replace(/^\/api\/coze-stream/, ''),
      },
    },
  },
});
