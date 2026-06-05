import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/FreelanceLandingPage/',
  server: {
    proxy: {
      '/Profile-images': {
        target: 'http://localhost5214:',
        changeOrigin: true,
        secure: false,
      },
      '/Images': {
        target: 'http://localhost:5214',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
