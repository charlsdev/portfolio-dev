import { loadCv } from '@/server/cv-source'
import { listSections } from '@/server/sections-repo'
import { SECTION_DEFS } from '@/sections'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
   const [cv, rows] = await Promise.all([loadCv(), listSections()])
   // Fallback a los defaults si la tabla aún no fue sembrada.
   const sections = rows.length
      ? rows.map((r) => ({ key: r.key, inDev: r.inDev }))
      : SECTION_DEFS.map((d) => ({ key: d.key, inDev: d.inDev }))
   return { cv, sections }
}
