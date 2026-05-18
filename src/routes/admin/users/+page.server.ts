import { fail } from '@sveltejs/kit'
import {
   createUser,
   deleteUser,
   getUserByCedula,
   listUsers,
   setUserActive,
   setUserPassword,
} from '@/server/users-repo'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
   return { users: await listUsers(), meId: locals.user?.id ?? null }
}

export const actions: Actions = {
   create: async ({ request }) => {
      const f = await request.formData()
      const cedula = (f.get('cedula') ?? '').toString().trim()
      const fullName = (f.get('fullName') ?? '').toString().trim()
      const password = (f.get('password') ?? '').toString()

      if (!cedula || !fullName || password.length < 6) {
         return fail(400, {
            error: 'Cédula, nombres y una contraseña de al menos 6 caracteres son obligatorios',
         })
      }
      if (await getUserByCedula(cedula)) {
         return fail(409, { error: `Ya existe un usuario con la cédula ${cedula}` })
      }
      await createUser(cedula, fullName, password)
      return { saved: true }
   },

   setActive: async ({ request, locals }) => {
      const f = await request.formData()
      const id = Number(f.get('id'))
      const active = f.get('active') === 'true'
      if (id === locals.user?.id && !active) {
         return fail(400, { error: 'No podés desactivar tu propia cuenta' })
      }
      await setUserActive(id, active)
      return { saved: true }
   },

   setPassword: async ({ request }) => {
      const f = await request.formData()
      const id = Number(f.get('id'))
      const password = (f.get('password') ?? '').toString()
      if (password.length < 6) {
         return fail(400, { error: 'La contraseña debe tener al menos 6 caracteres' })
      }
      await setUserPassword(id, password)
      return { saved: true }
   },

   delete: async ({ request, locals }) => {
      const f = await request.formData()
      const id = Number(f.get('id'))
      if (id === locals.user?.id) {
         return fail(400, { error: 'No podés eliminar tu propia cuenta' })
      }
      await deleteUser(id)
      return { saved: true }
   },
}
