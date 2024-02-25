import path from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [svelte()],
   server: {
      port: 4000,
   },
   resolve: {
      alias: {
         '@': path.resolve(__dirname, 'src'),
         '@cv': path.resolve(__dirname, 'src/cv.json'),
      },
   },
})
