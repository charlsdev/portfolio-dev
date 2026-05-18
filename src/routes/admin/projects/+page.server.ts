import { fail } from '@sveltejs/kit'
import {
   createProject,
   deleteProject,
   listProjects,
   reorderProjects,
   updateProject,
} from '@/server/cv-repo'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => ({ items: await listProjects() })

export const actions: Actions = {
   create: async ({ request }) => {
      const f = await request.formData()
      if (!(f.get('name') ?? '').toString().trim()) {
         return fail(400, { error: 'El nombre del proyecto es obligatorio' })
      }
      await createProject(f)
      return { saved: true }
   },
   update: async ({ request }) => {
      const f = await request.formData()
      await updateProject(Number(f.get('id')), f)
      return { saved: true }
   },
   delete: async ({ request }) => {
      const f = await request.formData()
      await deleteProject(Number(f.get('id')))
      return { saved: true }
   },
   reorder: async ({ request }) => {
      const f = await request.formData()
      const ids = JSON.parse((f.get('ids') ?? '[]').toString()) as number[]
      await reorderProjects(ids.map(Number))
      return { saved: true }
   },
}
