import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` + hash routing means the build works from any sub-path,
// including GitHub Pages project sites (user.github.io/repo/).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
  },
})
