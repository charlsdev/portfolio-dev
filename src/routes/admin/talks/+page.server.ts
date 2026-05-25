import { fail } from '@sveltejs/kit'
import { createTalk, deleteTalk, listTalks, reorderTalks, updateTalk } from '@/server/cv-repo'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => ({ items: await listTalks() })

export const actions: Actions = {
   create: async ({ request }) => {
      const f = await request.formData()
      if (!(f.get('title') ?? '').toString().trim()) {
         return fail(400, { error: 'El título es obligatorio' })
      }
      await createTalk(f)
      return { saved: true }
   },
   update: async ({ request }) => {
      const f = await request.formData()
      await updateTalk(Number(f.get('id')), f)
      return { saved: true }
   },
   delete: async ({ request }) => {
      const f = await request.formData()
      await deleteTalk(Number(f.get('id')))
      return { saved: true }
   },
   reorder: async ({ request }) => {
      const f = await request.formData()
      const ids = JSON.parse((f.get('ids') ?? '[]').toString()) as number[]
      await reorderTalks(ids.map(Number))
      return { saved: true }
   },
}
