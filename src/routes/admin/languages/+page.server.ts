import { fail } from '@sveltejs/kit'
import {
   createLanguage,
   deleteLanguage,
   listLanguages,
   reorderLanguages,
   updateLanguage,
} from '@/server/cv-repo'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => ({ items: await listLanguages() })

export const actions: Actions = {
   create: async ({ request }) => {
      const f = await request.formData()
      if (!(f.get('language') ?? '').toString().trim()) {
         return fail(400, { error: 'El idioma es obligatorio' })
      }
      await createLanguage(f)
      return { saved: true }
   },
   update: async ({ request }) => {
      const f = await request.formData()
      await updateLanguage(Number(f.get('id')), f)
      return { saved: true }
   },
   delete: async ({ request }) => {
      const f = await request.formData()
      await deleteLanguage(Number(f.get('id')))
      return { saved: true }
   },
   reorder: async ({ request }) => {
      const f = await request.formData()
      const ids = JSON.parse((f.get('ids') ?? '[]').toString()) as number[]
      await reorderLanguages(ids.map(Number))
      return { saved: true }
   },
}
