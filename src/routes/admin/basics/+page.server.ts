import { fail } from '@sveltejs/kit'
import { getBasics, upsertBasics } from '@/server/cv-repo'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
   return { basics: await getBasics() }
}

export const actions: Actions = {
   default: async ({ request }) => {
      const f = await request.formData()
      if (!(f.get('name') ?? '').toString().trim()) {
         return fail(400, { error: 'El nombre es obligatorio' })
      }
      await upsertBasics(f)
      return { saved: true }
   },
}
