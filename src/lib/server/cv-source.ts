import { asc } from 'drizzle-orm'
import type { Root } from '@/cv'
import { db, schema } from './db'

// Arma el objeto `Root` (consumido por los componentes vía getCv()) desde
// Postgres. Único punto de lectura.
export async function loadCv(): Promise<Root> {
   const [
      basicsRows,
      profilesRows,
      workRows,
      workHl,
      educationRows,
      projectsRows,
      projectHl,
      skillsRows,
      languagesRows,
      coursesRows,
      talksRows,
      publicationsRows,
      researchRows,
      awardsRows,
   ] = await Promise.all([
      db.select().from(schema.basics).limit(1),
      db.select().from(schema.profiles).orderBy(asc(schema.profiles.sortOrder)),
      db.select().from(schema.work).orderBy(asc(schema.work.sortOrder)),
      db.select().from(schema.workHighlights).orderBy(asc(schema.workHighlights.sortOrder)),
      db.select().from(schema.education).orderBy(asc(schema.education.sortOrder)),
      db.select().from(schema.projects).orderBy(asc(schema.projects.sortOrder)),
      db
         .select()
         .from(schema.projectHighlights)
         .orderBy(asc(schema.projectHighlights.sortOrder)),
      db.select().from(schema.skills).orderBy(asc(schema.skills.sortOrder)),
      db.select().from(schema.languages).orderBy(asc(schema.languages.sortOrder)),
      db.select().from(schema.courses).orderBy(asc(schema.courses.sortOrder)),
      db.select().from(schema.talks).orderBy(asc(schema.talks.sortOrder)),
      db.select().from(schema.publications).orderBy(asc(schema.publications.sortOrder)),
      db.select().from(schema.research).orderBy(asc(schema.research.sortOrder)),
      db.select().from(schema.awards).orderBy(asc(schema.awards.sortOrder)),
   ])

   const b = basicsRows[0]

   const hlByWork = new Map<number, string[]>()
   for (const h of workHl) {
      const arr = hlByWork.get(h.workId) ?? []
      arr.push(h.text)
      hlByWork.set(h.workId, arr)
   }
   const hlByProject = new Map<number, string[]>()
   for (const h of projectHl) {
      const arr = hlByProject.get(h.projectId) ?? []
      arr.push(h.text)
      hlByProject.set(h.projectId, arr)
   }

   return {
      basics: {
         name: b?.name ?? '',
         label: b?.label ?? '',
         image: b?.image ?? '',
         email: b?.email ?? '',
         phone: b?.phone ?? '',
         url: b?.url ?? '',
         summary: b?.summary ?? '',
         location: {
            address: b?.address ?? '',
            postalCode: b?.postalCode ?? '',
            city: b?.city ?? '',
            countryCode: b?.countryCode ?? '',
            region: b?.region ?? '',
         },
         profiles: profilesRows.map((p) => ({
            network: p.network,
            username: p.username,
            url: p.url,
         })),
      },
      work: workRows.map((w) => ({
         name: w.name,
         position: w.position,
         url: w.url ?? undefined,
         startDate: w.startDate ?? '',
         endDate: w.endDate ?? undefined,
         summary: w.summary,
         highlights: hlByWork.get(w.id) ?? [],
      })),
      education: educationRows.map((e) => ({
         institution: e.institution,
         url: e.url ?? '',
         area: e.area,
         studyType: e.studyType,
         startDate: e.startDate ?? '',
         endDate: e.endDate ?? '',
         score: e.score,
         courses: [],
      })),
      projects: projectsRows.map((p) => ({
         name: p.name,
         isActive: p.isActive,
         description: p.description,
         highlights: hlByProject.get(p.id) ?? [],
         url: p.url,
         github: p.github ?? undefined,
      })),
      skills: skillsRows.map((s) => ({ name: s.name, description: s.description })),
      languages: languagesRows.map((l) => ({
         language: l.language,
         fluency: l.fluency,
      })),
      courses: coursesRows.map((c) => ({
         title: c.title,
         institution: c.institution,
         hours: c.hours,
         location: c.location,
         startDate: c.startDate,
         endDate: c.endDate,
      })),
      talks: talksRows.map((t) => ({
         title: t.title,
         institution: t.institution,
         congress: t.congress,
         location: t.location,
         dates: t.dates,
      })),
      publications: publicationsRows.map((p) => ({
         title: p.title,
         institution: p.institution,
         coauthors: p.coauthors,
         journal: p.journal,
         year: p.year,
      })),
      research: researchRows.map((r) => ({
         title: r.title,
         institution: r.institution,
         authors: r.authors,
         startYear: r.startYear,
         endYear: r.endYear,
      })),
      awards: awardsRows.map((a) => ({
         title: a.title,
         institution: a.institution,
         startYear: a.startYear,
         endYear: a.endYear,
      })),
   }
}
