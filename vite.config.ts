import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app/frontend'),
      crypto: 'crypto-browserify'
    },
  },
  optimizeDeps: {
    include: [
      '@react-three/fiber',
      '@react-three/drei',
      'three',
      'crypto-browserify'
    ],
  },
})