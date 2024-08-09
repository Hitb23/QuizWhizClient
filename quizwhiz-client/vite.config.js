import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  build: {
    chunkSizeWarningLimit: 1000 // Set limit to 1000 kB or a value that suits your needs
  }
})

