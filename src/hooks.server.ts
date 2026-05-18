import { redirect, type Handle } from '@sveltejs/kit'
import { SESSION_COOKIE, parseSession } from '@/server/auth'
import { getActiveUserById } from '@/server/users-repo'

export const handle: Handle = async ({ event, resolve }) => {
   const userId = parseSession(event.cookies.get(SESSION_COOKIE))
   // La cookie es válida solo si además el usuario existe y sigue activo
   // (permite revocar acceso al instante deshabilitándolo).
   const user = userId != null ? await getActiveUserById(userId) : null
   event.locals.user = user
   event.locals.admin = user != null

   const { pathname } = event.url
   const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/')
   const isLogin = pathname === '/admin/login'

   if (isAdminArea && !isLogin && !event.locals.admin) {
      throw redirect(303, `/admin/login?next=${encodeURIComponent(pathname)}`)
   }
   if (isLogin && event.locals.admin) {
      throw redirect(303, '/admin')
   }

   return resolve(event)
}
