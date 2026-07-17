import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  server: {
    proxy: {
      '/Profile-images': {
        target: 'https://invoiceapi-gcc3duhbc4age6bw.southafricanorth-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/Images': {
        target: 'https://invoiceapi-gcc3duhbc4age6bw.southafricanorth-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
