import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Change this to your desired port
    strictPort: true, // Optional: prevents fallback to next available port if 5173 is taken
  }

})
