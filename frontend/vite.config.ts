import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @app/shared/types → ../shared/types/index.ts に解決される
      '@app/shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    proxy: {
      // バックエンド API へのリクエストをプロキシ
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
