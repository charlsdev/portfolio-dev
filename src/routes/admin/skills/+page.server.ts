import { fail } from '@sveltejs/kit'
import { createSkill, deleteSkill, listSkills, updateSkill } from '@/server/cv-repo'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => ({ items: await listSkills() })

export const actions: Actions = {
   create: async ({ request }) => {
      const f = await request.formData()
      if (!(f.get('name') ?? '').toString().trim()) {
         return fail(400, { error: 'El nombre es obligatorio' })
      }
      await createSkill(f)
      return { saved: true }
   },
   update: async ({ request }) => {
      const f = await request.formData()
      await updateSkill(Number(f.get('id')), f)
      return { saved: true }
   },
   delete: async ({ request }) => {
      const f = await request.formData()
      await deleteSkill(Number(f.get('id')))
      return { saved: true }
   },
}
