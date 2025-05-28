// The-Human-Tech-Blog-React/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Proxy para o backend
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Isso limpa o diretório antes de cada build
  },
});
