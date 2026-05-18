import { fail } from '@sveltejs/kit'
import {
   createProfile,
   deleteProfile,
   listProfiles,
   reorderProfiles,
   updateProfile,
} from '@/server/cv-repo'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => ({ items: await listProfiles() })

export const actions: Actions = {
   create: async ({ request }) => {
      const f = await request.formData()
      if (!(f.get('network') ?? '').toString().trim()) {
         return fail(400, { error: 'La red es obligatoria' })
      }
      await createProfile(f)
      return { saved: true }
   },
   update: async ({ request }) => {
      const f = await request.formData()
      await updateProfile(Number(f.get('id')), f)
      return { saved: true }
   },
   delete: async ({ request }) => {
      const f = await request.formData()
      await deleteProfile(Number(f.get('id')))
      return { saved: true }
   },
   reorder: async ({ request }) => {
      const f = await request.formData()
      const ids = JSON.parse((f.get('ids') ?? '[]').toString()) as number[]
      await reorderProfiles(ids.map(Number))
      return { saved: true }
   },
}
