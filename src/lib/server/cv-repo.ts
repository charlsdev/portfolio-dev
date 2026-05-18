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
         sortOrder: Number(f.get('sortOrder') ?? 0),
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
         sortOrder: Number(f.get('sortOrder') ?? 0),
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
         sortOrder: Number(f.get('sortOrder') ?? 0),
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
         sortOrder: Number(f.get('sortOrder') ?? 0),
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
         sortOrder: Number(f.get('sortOrder') ?? 0),
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
         sortOrder: Number(f.get('sortOrder') ?? 0),
      })
      .where(eq(schema.projects.id, id))
   await replaceProjectHighlights(id, linesToList(f.get('highlights')))
}
export const deleteProject = (id: number) =>
   db.delete(schema.projects).where(eq(schema.projects.id, id))
