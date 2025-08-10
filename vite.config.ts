/// <reference types="node" />

import { defineConfig } from 'vite';
import RubyPlugin from 'vite-plugin-ruby';
import react from '@vitejs/plugin-react';
import path from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    RubyPlugin(),
    react({
      babel: {
        plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
      },
    }),
  ],
  build: {
    outDir: '../public/vite-assets',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: 'app/frontend/entrypoints/application.tsx',
    },
  },
  publicDir: '../public',
  base: '/',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, './'),
      crypto: 'crypto-browserify',
    },
  },
  optimizeDeps: {
    include: [
      'crypto-browserify',
      'chartkick',
      'chart.js',
    ],
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
});
