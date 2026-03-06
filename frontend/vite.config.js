import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command, mode }) => {
  // Load all .env files
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(),tailwindcss(),],
    define: {
      // Make process.env available globally
      'process.env': env
    }
  }
})


