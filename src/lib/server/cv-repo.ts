import { asc, eq, sql } from 'drizzle-orm'
import type { PgColumn } from 'drizzle-orm/pg-core'
import { db, schema } from './db'

// CRUD que usan las acciones del panel admin. Las fechas viajan como
// 'YYYY-MM-DD' o null. Highlights se editan embebidos en work/project.

const emptyToNull = (v: FormDataEntryValue | null): string | null => {
   const s = (v ?? '').toString().trim()
   return s === '' ? null : s
}
const str = (v: FormDataEntryValue | null): string => (v ?? '').toString().trim()
const linesToList = (v: FormDataEntryValue | null): string[] =>
   str(v)
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
const intOrNull = (v: FormDataEntryValue | null): number | null => {
   const s = str(v)
   if (s === '') return null
   const n = Number(s)
   return Number.isFinite(n) ? Math.trunc(n) : null
}

async function nextSort(sortCol: PgColumn): Promise<number> {
   const [r] = await db
      .select({ n: sql<number>`coalesce(max(${sortCol}), -1) + 1` })
      .from(sortCol.table)
   return r?.n ?? 0
}

/* ---------- basics (singleton) ---------- */

export async function getBasics() {
   const [b] = await db.select().from(schema.basics).limit(1)
   return b ?? null
}

export async function upsertBasics(f: FormData) {
   const values = {
      name: str(f.get('name')),
      label: str(f.get('label')),
      image: str(f.get('image')),
      email: str(f.get('email')),
      phone: str(f.get('phone')),
      url: str(f.get('url')),
      summary: str(f.get('summary')),
      address: str(f.get('address')),
      postalCode: str(f.get('postalCode')),
      city: str(f.get('city')),
      countryCode: str(f.get('countryCode')),
      region: str(f.get('region')),
      updatedAt: new Date(),
   }
   const existing = await getBasics()
   if (existing) {
      await db.update(schema.basics).set(values).where(eq(schema.basics.id, existing.id))
   } else {
      await db.insert(schema.basics).values(values)
   }
}

/* ---------- profiles ---------- */

export const listProfiles = () =>
   db.select().from(schema.profiles).orderBy(asc(schema.profiles.sortOrder))

export async function createProfile(f: FormData) {
   await db.insert(schema.profiles).values({
      network: str(f.get('network')),
      username: str(f.get('username')),
      url: str(f.get('url')),
      sortOrder: await nextSort(schema.profiles.sortOrder),
   })
}
export async function updateProfile(id: number, f: FormData) {
   await db
      .update(schema.profiles)
      .set({
         network: str(f.get('network')),
         username: str(f.get('username')),
         url: str(f.get('url')),
      })
      .where(eq(schema.profiles.id, id))
}
export const deleteProfile = (id: number) =>
   db.delete(schema.profiles).where(eq(schema.profiles.id, id))

/* ---------- skills ---------- */

export const listSkills = () =>
   db.select().from(schema.skills).orderBy(asc(schema.skills.sortOrder))

export async function createSkill(f: FormData) {
   await db.insert(schema.skills).values({
      name: str(f.get('name')),
      description: str(f.get('description')),
      sortOrder: await nextSort(schema.skills.sortOrder),
   })
}
export async function updateSkill(id: number, f: FormData) {
   await db
      .update(schema.skills)
      .set({
         name: str(f.get('name')),
         description: str(f.get('description')),
      })
      .where(eq(schema.skills.id, id))
}
export const deleteSkill = (id: number) =>
   db.delete(schema.skills).where(eq(schema.skills.id, id))

/* ---------- languages ---------- */

export const listLanguages = () =>
   db.select().from(schema.languages).orderBy(asc(schema.languages.sortOrder))

export async function createLanguage(f: FormData) {
   await db.insert(schema.languages).values({
      language: str(f.get('language')),
      fluency: str(f.get('fluency')),
      sortOrder: await nextSort(schema.languages.sortOrder),
   })
}
export async function updateLanguage(id: number, f: FormData) {
   await db
      .update(schema.languages)
      .set({
         language: str(f.get('language')),
         fluency: str(f.get('fluency')),
      })
      .where(eq(schema.languages.id, id))
}
export const deleteLanguage = (id: number) =>
   db.delete(schema.languages).where(eq(schema.languages.id, id))

/* ---------- education ---------- */

export const listEducation = () =>
   db.select().from(schema.education).orderBy(asc(schema.education.sortOrder))

export async function createEducation(f: FormData) {
   await db.insert(schema.education).values({
      institution: str(f.get('institution')),
      url: emptyToNull(f.get('url')),
      area: str(f.get('area')),
      studyType: str(f.get('studyType')),
      startDate: emptyToNull(f.get('startDate')),
      endDate: emptyToNull(f.get('endDate')),
      score: str(f.get('score')),
      sortOrder: await nextSort(schema.education.sortOrder),
   })
}
export async function updateEducation(id: number, f: FormData) {
   await db
      .update(schema.education)
      .set({
         institution: str(f.get('institution')),
         url: emptyToNull(f.get('url')),
         area: str(f.get('area')),
         studyType: str(f.get('studyType')),
         startDate: emptyToNull(f.get('startDate')),
         endDate: emptyToNull(f.get('endDate')),
         score: str(f.get('score')),
      })
      .where(eq(schema.education.id, id))
}
export const deleteEducation = (id: number) =>
   db.delete(schema.education).where(eq(schema.education.id, id))

/* ---------- work (+ highlights) ---------- */

export async function listWork() {
   const rows = await db.select().from(schema.work).orderBy(asc(schema.work.sortOrder))
   const hl = await db
      .select()
      .from(schema.workHighlights)
      .orderBy(asc(schema.workHighlights.sortOrder))
   return rows.map((w) => ({
      ...w,
      highlights: hl.filter((h) => h.workId === w.id).map((h) => h.text),
   }))
}

async function replaceWorkHighlights(workId: number, items: string[]) {
   await db.delete(schema.workHighlights).where(eq(schema.workHighlights.workId, workId))
   if (items.length) {
      await db
         .insert(schema.workHighlights)
         .values(items.map((text, i) => ({ workId, text, sortOrder: i })))
   }
}

export async function createWork(f: FormData) {
   const [row] = await db
      .insert(schema.work)
      .values({
         name: str(f.get('name')),
         position: str(f.get('position')),
         url: emptyToNull(f.get('url')),
         startDate: emptyToNull(f.get('startDate')),
         endDate: emptyToNull(f.get('endDate')),
         summary: str(f.get('summary')),
         sortOrder: await nextSort(schema.work.sortOrder),
      })
      .returning({ id: schema.work.id })
   await replaceWorkHighlights(row.id, linesToList(f.get('highlights')))
}
export async function updateWork(id: number, f: FormData) {
   await db
      .update(schema.work)
      .set({
         name: str(f.get('name')),
         position: str(f.get('position')),
         url: emptyToNull(f.get('url')),
         startDate: emptyToNull(f.get('startDate')),
         endDate: emptyToNull(f.get('endDate')),
         summary: str(f.get('summary')),
      })
      .where(eq(schema.work.id, id))
   await replaceWorkHighlights(id, linesToList(f.get('highlights')))
}
export const deleteWork = (id: number) =>
   db.delete(schema.work).where(eq(schema.work.id, id))

/* ---------- projects (+ highlights) ---------- */

export async function listProjects() {
   const rows = await db
      .select()
      .from(schema.projects)
      .orderBy(asc(schema.projects.sortOrder))
   const hl = await db
      .select()
      .from(schema.projectHighlights)
      .orderBy(asc(schema.projectHighlights.sortOrder))
   return rows.map((p) => ({
      ...p,
      highlights: hl.filter((h) => h.projectId === p.id).map((h) => h.text),
   }))
}

async function replaceProjectHighlights(projectId: number, items: string[]) {
   await db
      .delete(schema.projectHighlights)
      .where(eq(schema.projectHighlights.projectId, projectId))
   if (items.length) {
      await db
         .insert(schema.projectHighlights)
         .values(items.map((text, i) => ({ projectId, text, sortOrder: i })))
   }
}

export async function createProject(f: FormData) {
   const [row] = await db
      .insert(schema.projects)
      .values({
         name: str(f.get('name')),
         isActive: f.get('isActive') === 'on',
         description: str(f.get('description')),
         url: str(f.get('url')),
         github: emptyToNull(f.get('github')),
         sortOrder: await nextSort(schema.projects.sortOrder),
      })
      .returning({ id: schema.projects.id })
   await replaceProjectHighlights(row.id, linesToList(f.get('highlights')))
}
export async function updateProject(id: number, f: FormData) {
   await db
      .update(schema.projects)
      .set({
         name: str(f.get('name')),
         isActive: f.get('isActive') === 'on',
         description: str(f.get('description')),
         url: str(f.get('url')),
         github: emptyToNull(f.get('github')),
      })
      .where(eq(schema.projects.id, id))
   await replaceProjectHighlights(id, linesToList(f.get('highlights')))
}
export const deleteProject = (id: number) =>
   db.delete(schema.projects).where(eq(schema.projects.id, id))

/* ---------- reorder (drag & drop) ---------- */
// Persiste el nuevo orden: sort_order = índice en el array de ids.
// Explícitas por tabla para mantener el tipado de drizzle.

export const reorderProfiles = (ids: number[]) =>
   db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
         await tx
            .update(schema.profiles)
            .set({ sortOrder: i })
            .where(eq(schema.profiles.id, ids[i]))
      }
   })

export const reorderSkills = (ids: number[]) =>
   db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
         await tx
            .update(schema.skills)
            .set({ sortOrder: i })
            .where(eq(schema.skills.id, ids[i]))
      }
   })

export const reorderLanguages = (ids: number[]) =>
   db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
         await tx
            .update(schema.languages)
            .set({ sortOrder: i })
            .where(eq(schema.languages.id, ids[i]))
      }
   })

export const reorderEducation = (ids: number[]) =>
   db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
         await tx
            .update(schema.education)
            .set({ sortOrder: i })
            .where(eq(schema.education.id, ids[i]))
      }
   })

export const reorderWork = (ids: number[]) =>
   db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
         await tx
            .update(schema.work)
            .set({ sortOrder: i })
            .where(eq(schema.work.id, ids[i]))
      }
   })

export const reorderProjects = (ids: number[]) =>
   db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
         await tx
            .update(schema.projects)
            .set({ sortOrder: i })
            .where(eq(schema.projects.id, ids[i]))
      }
   })

/* ---------- courses (cursos / capacitaciones) ---------- */

export const listCourses = () =>
   db.select().from(schema.courses).orderBy(asc(schema.courses.sortOrder))

export async function createCourse(f: FormData) {
   await db.insert(schema.courses).values({
      title: str(f.get('title')),
      institution: str(f.get('institution')),
      hours: str(f.get('hours')),
      location: str(f.get('location')),
      startDate: emptyToNull(f.get('startDate')),
      endDate: emptyToNull(f.get('endDate')),
      sortOrder: await nextSort(schema.courses.sortOrder),
   })
}
export async function updateCourse(id: number, f: FormData) {
   await db
      .update(schema.courses)
      .set({
         title: str(f.get('title')),
         institution: str(f.get('institution')),
         hours: str(f.get('hours')),
         location: str(f.get('location')),
         startDate: emptyToNull(f.get('startDate')),
         endDate: emptyToNull(f.get('endDate')),
      })
      .where(eq(schema.courses.id, id))
}
export const deleteCourse = (id: number) =>
   db.delete(schema.courses).where(eq(schema.courses.id, id))
export const reorderCourses = (ids: number[]) =>
   db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++)
         await tx.update(schema.courses).set({ sortOrder: i }).where(eq(schema.courses.id, ids[i]))
   })

/* ---------- talks (ponencias) ---------- */

export const listTalks = () =>
   db.select().from(schema.talks).orderBy(asc(schema.talks.sortOrder))

export async function createTalk(f: FormData) {
   await db.insert(schema.talks).values({
      title: str(f.get('title')),
      institution: str(f.get('institution')),
      congress: str(f.get('congress')),
      location: str(f.get('location')),
      dates: str(f.get('dates')),
      sortOrder: await nextSort(schema.talks.sortOrder),
   })
}
export async function updateTalk(id: number, f: FormData) {
   await db
      .update(schema.talks)
      .set({
         title: str(f.get('title')),
         institution: str(f.get('institution')),
         congress: str(f.get('congress')),
         location: str(f.get('location')),
         dates: str(f.get('dates')),
      })
      .where(eq(schema.talks.id, id))
}
export const deleteTalk = (id: number) =>
   db.delete(schema.talks).where(eq(schema.talks.id, id))
export const reorderTalks = (ids: number[]) =>
   db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++)
         await tx.update(schema.talks).set({ sortOrder: i }).where(eq(schema.talks.id, ids[i]))
   })

/* ---------- publications (publicaciones) ---------- */

export const listPublications = () =>
   db.select().from(schema.publications).orderBy(asc(schema.publications.sortOrder))

export async function createPublication(f: FormData) {
   await db.insert(schema.publications).values({
      title: str(f.get('title')),
      institution: str(f.get('institution')),
      coauthors: str(f.get('coauthors')),
      journal: str(f.get('journal')),
      year: intOrNull(f.get('year')),
      sortOrder: await nextSort(schema.publications.sortOrder),
   })
}
export async function updatePublication(id: number, f: FormData) {
   await db
      .update(schema.publications)
      .set({
         title: str(f.get('title')),
         institution: str(f.get('institution')),
         coauthors: str(f.get('coauthors')),
         journal: str(f.get('journal')),
         year: intOrNull(f.get('year')),
      })
      .where(eq(schema.publications.id, id))
}
export const deletePublication = (id: number) =>
   db.delete(schema.publications).where(eq(schema.publications.id, id))
export const reorderPublications = (ids: number[]) =>
   db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++)
         await tx
            .update(schema.publications)
            .set({ sortOrder: i })
            .where(eq(schema.publications.id, ids[i]))
   })

/* ---------- awards (méritos y distinciones) ---------- */

export const listAwards = () =>
   db.select().from(schema.awards).orderBy(asc(schema.awards.sortOrder))

export async function createAward(f: FormData) {
   await db.insert(schema.awards).values({
      title: str(f.get('title')),
      institution: str(f.get('institution')),
      startYear: intOrNull(f.get('startYear')),
      endYear: intOrNull(f.get('endYear')),
      sortOrder: await nextSort(schema.awards.sortOrder),
   })
}
export async function updateAward(id: number, f: FormData) {
   await db
      .update(schema.awards)
      .set({
         title: str(f.get('title')),
         institution: str(f.get('institution')),
         startYear: intOrNull(f.get('startYear')),
         endYear: intOrNull(f.get('endYear')),
      })
      .where(eq(schema.awards.id, id))
}
export const deleteAward = (id: number) =>
   db.delete(schema.awards).where(eq(schema.awards.id, id))
export const reorderAwards = (ids: number[]) =>
   db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++)
         await tx.update(schema.awards).set({ sortOrder: i }).where(eq(schema.awards.id, ids[i]))
   })

/* ---------- research (investigaciones) ---------- */

export const listResearch = () =>
   db.select().from(schema.research).orderBy(asc(schema.research.sortOrder))

export async function createResearch(f: FormData) {
   await db.insert(schema.research).values({
      title: str(f.get('title')),
      institution: str(f.get('institution')),
      authors: str(f.get('authors')),
      startYear: intOrNull(f.get('startYear')),
      endYear: intOrNull(f.get('endYear')),
      sortOrder: await nextSort(schema.research.sortOrder),
   })
}
export async function updateResearch(id: number, f: FormData) {
   await db
      .update(schema.research)
      .set({
         title: str(f.get('title')),
         institution: str(f.get('institution')),
         authors: str(f.get('authors')),
         startYear: intOrNull(f.get('startYear')),
         endYear: intOrNull(f.get('endYear')),
      })
      .where(eq(schema.research.id, id))
}
export const deleteResearch = (id: number) =>
   db.delete(schema.research).where(eq(schema.research.id, id))
export const reorderResearch = (ids: number[]) =>
   db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++)
         await tx
            .update(schema.research)
            .set({ sortOrder: i })
            .where(eq(schema.research.id, ids[i]))
   })
