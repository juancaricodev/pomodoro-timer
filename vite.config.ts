import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For Vitest config, see vitest.config.ts
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
