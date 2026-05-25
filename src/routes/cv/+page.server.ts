import { loadCv } from '@/server/cv-source'
import { listSections } from '@/server/sections-repo'
import { SECTION_DEFS } from '@/sections'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
   const mode = url.searchParams.get('mode') === 'completo' ? 'completo' : 'dev'
   const [cv, rows] = await Promise.all([loadCv(), listSections()])
   const sections = rows.length
      ? rows.map((r) => ({ key: r.key, inDev: r.inDev }))
      : SECTION_DEFS.map((d) => ({ key: d.key, inDev: d.inDev }))
   return { cv, mode, sections }
}
