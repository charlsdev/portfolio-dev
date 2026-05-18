import { loadCv } from '@/server/cv-source'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
   return { cv: await loadCv() }
}
