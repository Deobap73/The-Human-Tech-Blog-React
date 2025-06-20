// The-Human-Tech-Blog-React/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  // Defina o base URL corretamente para seu ambiente de produção
  base: process.env.NODE_ENV === 'production' ? '/' : '/',

  // Adicione resolução de caminhos (recomendado mesmo se não usar aliases)
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~public': fileURLToPath(new URL('./public', import.meta.url)),
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Configuração adicional para assets
    assetsInlineLimit: 4096, // Arquivos menores que 4kb serão inline base64
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});
