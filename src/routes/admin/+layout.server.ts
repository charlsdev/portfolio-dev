import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ locals, url }) => {
   // Defensa en profundidad: hooks.server.ts ya redirige, esto cubre
   // cualquier ruta admin nueva que se agregue sin tocar los hooks.
   if (!locals.admin && url.pathname !== '/admin/login') {
      throw redirect(303, `/admin/login?next=${encodeURIComponent(url.pathname)}`)
   }
   return { admin: locals.admin, me: locals.user }
}
