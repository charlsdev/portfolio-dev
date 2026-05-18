import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
   preprocess: vitePreprocess(),
   kit: {
      adapter: adapter(),
      // Mantiene los imports `@/...` de los componentes originales apuntando a src/lib
      alias: {
         '@': 'src/lib',
         '@/*': 'src/lib/*',
      },
   },
}

export default config
