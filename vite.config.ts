// The-Human-Tech-Blog-React/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for The Human Tech Blog React frontend
// Ensures API and Socket.IO requests are proxied to backend for proper cookie/auth support

export default defineConfig({
  plugins: [react()],
  // No absolute imports (@) are used; only relative paths in the project.
  // If you want to allow absolute imports later, uncomment the alias below.
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'),
  //   },
  // },
  server: {
    proxy: {
      // Proxy all API requests to Express backend to solve CORS/cookie issues in dev
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy Socket.IO for real-time features (notifications/chat)
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
    emptyOutDir: true, // Clean the output directory before each build
  },
});
