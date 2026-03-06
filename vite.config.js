import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change '/nbs-scrim-tracker/' to match your GitHub repo name
export default defineConfig({
  plugins: [react()],
  base: '/nbs-scrim-tracker/',
})
