import { db, schema } from '@/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
   const [profiles, work, education, projects, skills, languages] = await Promise.all([
      db.$count(schema.profiles),
      db.$count(schema.work),
      db.$count(schema.education),
      db.$count(schema.projects),
      db.$count(schema.skills),
      db.$count(schema.languages),
   ])
   return { counts: { profiles, work, education, projects, skills, languages } }
}
