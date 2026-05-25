import { fail } from '@sveltejs/kit'
import {
   createCourse,
   deleteCourse,
   listCourses,
   reorderCourses,
   updateCourse,
} from '@/server/cv-repo'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => ({ items: await listCourses() })

export const actions: Actions = {
   create: async ({ request }) => {
      const f = await request.formData()
      if (!(f.get('title') ?? '').toString().trim()) {
         return fail(400, { error: 'El título es obligatorio' })
      }
      await createCourse(f)
      return { saved: true }
   },
   update: async ({ request }) => {
      const f = await request.formData()
      await updateCourse(Number(f.get('id')), f)
      return { saved: true }
   },
   delete: async ({ request }) => {
      const f = await request.formData()
      await deleteCourse(Number(f.get('id')))
      return { saved: true }
   },
   reorder: async ({ request }) => {
      const f = await request.formData()
      const ids = JSON.parse((f.get('ids') ?? '[]').toString()) as number[]
      await reorderCourses(ids.map(Number))
      return { saved: true }
   },
}
