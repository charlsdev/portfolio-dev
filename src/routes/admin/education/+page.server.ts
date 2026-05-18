import { fail } from '@sveltejs/kit'
import {
   createEducation,
   deleteEducation,
   listEducation,
   reorderEducation,
   updateEducation,
} from '@/server/cv-repo'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => ({ items: await listEducation() })

export const actions: Actions = {
   create: async ({ request }) => {
      const f = await request.formData()
      if (!(f.get('institution') ?? '').toString().trim()) {
         return fail(400, { error: 'La institución es obligatoria' })
      }
      await createEducation(f)
      return { saved: true }
   },
   update: async ({ request }) => {
      const f = await request.formData()
      await updateEducation(Number(f.get('id')), f)
      return { saved: true }
   },
   delete: async ({ request }) => {
      const f = await request.formData()
      await deleteEducation(Number(f.get('id')))
      return { saved: true }
   },
   reorder: async ({ request }) => {
      const f = await request.formData()
      const ids = JSON.parse((f.get('ids') ?? '[]').toString()) as number[]
      await reorderEducation(ids.map(Number))
      return { saved: true }
   },
}
