import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: '/integration-demo.html',
    proxy: {
      '/nexus': {
        target: 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net',
        changeOrigin: true,
        secure: true,
      }
    }
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
