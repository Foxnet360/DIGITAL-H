import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'motion/react': path.resolve(__dirname, './src/test/motion-mock.tsx'),
      'recharts': path.resolve(__dirname, './src/test/recharts-mock.tsx'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    testTimeout: 10000,
  },
})
