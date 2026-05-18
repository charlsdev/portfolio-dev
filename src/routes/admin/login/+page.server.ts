import { fail, redirect } from '@sveltejs/kit'
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions, verifyPassword } from '@/server/auth'
import { getUserByCedula } from '@/server/users-repo'
import type { Actions } from './$types'

export const actions: Actions = {
   default: async ({ request, cookies, url }) => {
      const f = await request.formData()
      const cedula = (f.get('cedula') ?? '').toString().trim()
      const password = (f.get('password') ?? '').toString()

      const user = await getUserByCedula(cedula)
      const ok = user != null && user.isActive && (await verifyPassword(password, user.passwordHash))

      if (!ok || !user) {
         return fail(401, { error: 'Cédula o contraseña incorrectas' })
      }

      cookies.set(SESSION_COOKIE, createSessionToken(user.id), sessionCookieOptions)

      const next = url.searchParams.get('next')
      throw redirect(303, next && next.startsWith('/admin') ? next : '/admin')
   },
}
