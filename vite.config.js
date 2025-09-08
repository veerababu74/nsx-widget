import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: '/integration-demo.html'
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: 'index.html'
      },
      output: {
        manualChunks: undefined
      }
    }
  },
  base: './'  // Ensure relative paths work in production
})
