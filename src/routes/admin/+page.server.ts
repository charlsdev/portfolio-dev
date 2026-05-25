import { db, schema } from '@/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
   const [
      profiles,
      work,
      education,
      projects,
      courses,
      talks,
      publications,
      research,
      awards,
      skills,
      languages,
   ] = await Promise.all([
      db.$count(schema.profiles),
      db.$count(schema.work),
      db.$count(schema.education),
      db.$count(schema.projects),
      db.$count(schema.courses),
      db.$count(schema.talks),
      db.$count(schema.publications),
      db.$count(schema.research),
      db.$count(schema.awards),
      db.$count(schema.skills),
      db.$count(schema.languages),
   ])
   return {
      counts: {
         profiles,
         work,
         education,
         projects,
         courses,
         talks,
         publications,
         research,
         awards,
         skills,
         languages,
      },
   }
}
