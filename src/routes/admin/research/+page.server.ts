import { fail } from '@sveltejs/kit'
import {
   createResearch,
   deleteResearch,
   listResearch,
   reorderResearch,
   updateResearch,
} from '@/server/cv-repo'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => ({ items: await listResearch() })

export const actions: Actions = {
   create: async ({ request }) => {
      const f = await request.formData()
      if (!(f.get('title') ?? '').toString().trim()) {
         return fail(400, { error: 'El título es obligatorio' })
      }
      await createResearch(f)
      return { saved: true }
   },
   update: async ({ request }) => {
      const f = await request.formData()
      await updateResearch(Number(f.get('id')), f)
      return { saved: true }
   },
   delete: async ({ request }) => {
      const f = await request.formData()
      await deleteResearch(Number(f.get('id')))
      return { saved: true }
   },
   reorder: async ({ request }) => {
      const f = await request.formData()
      const ids = JSON.parse((f.get('ids') ?? '[]').toString()) as number[]
      await reorderResearch(ids.map(Number))
      return { saved: true }
   },
}
