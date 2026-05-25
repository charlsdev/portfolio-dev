import {
   listSections,
   reorderSections,
   seedSections,
   setSectionDev,
} from '@/server/sections-repo'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
   await seedSections() // idempotente: asegura que existan las filas
   return { sections: await listSections() }
}

export const actions: Actions = {
   reorder: async ({ request }) => {
      const f = await request.formData()
      const ids = JSON.parse((f.get('ids') ?? '[]').toString()) as number[]
      await reorderSections(ids.map(Number))
      return { saved: true }
   },
   toggleDev: async ({ request }) => {
      const f = await request.formData()
      await setSectionDev(Number(f.get('id')), f.get('inDev') === 'true')
      return { saved: true }
   },
}
