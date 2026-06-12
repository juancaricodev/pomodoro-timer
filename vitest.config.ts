import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Separate Vitest config to avoid Vite 8 vs Vite 7 plugin type conflicts
// https://vitest.dev/config/
export default defineConfig({
  plugins: [react() as any],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
