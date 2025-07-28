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
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, './'),
      three: path.resolve(__dirname, './node_modules/three'),
      crypto: 'crypto-browserify',
    },
  },
  optimizeDeps: {
    include: [
      '@react-three/fiber',
      '@react-three/drei',
      'three',
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
    port: 5173,
    strictPort: true,
    proxy: {
      '^/(assets|api|vite-dev)': {
        target: 'http://localhost:5173',
        changeOrigin: true,
      },
    },
  },
});
