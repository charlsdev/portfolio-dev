import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
   // En dev, SvelteKit expone .env solo vía $env, no en process.env.
   // db/index.ts y los scripts leen process.env (mismo código en dev,
   // prod con `node --env-file` y Dokploy), así que lo poblamos acá.
   // Prefijo '' = carga TODAS las vars (incluidas las sin VITE_).
   Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

   return {
      plugins: [tailwindcss(), sveltekit()],
      server: {
         port: 4000,
      },
   }
})
