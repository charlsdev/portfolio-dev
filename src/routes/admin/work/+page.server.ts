import { fail } from '@sveltejs/kit'
import { createWork, deleteWork, listWork, updateWork } from '@/server/cv-repo'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => ({ items: await listWork() })

export const actions: Actions = {
   create: async ({ request }) => {
      const f = await request.formData()
      if (!(f.get('name') ?? '').toString().trim()) {
         return fail(400, { error: 'El nombre de la empresa es obligatorio' })
      }
      await createWork(f)
      return { saved: true }
   },
   update: async ({ request }) => {
      const f = await request.formData()
      await updateWork(Number(f.get('id')), f)
      return { saved: true }
   },
   delete: async ({ request }) => {
      const f = await request.formData()
      await deleteWork(Number(f.get('id')))
      return { saved: true }
   },
}
