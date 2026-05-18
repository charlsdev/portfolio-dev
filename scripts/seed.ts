import 'dotenv/config'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { db, schema } from '../src/lib/server/db/index.ts'

// Carga el CV en Postgres. Idempotente: vacía las tablas y reinserta.
// Fuente: src/cv.json (data real, gitignored) si existe; si no,
// src/cv.example.json (template del repo, para clones limpios).

type Json = Record<string, any>

const realUrl = new URL('../src/cv.json', import.meta.url)
const exampleUrl = new URL('../src/cv.example.json', import.meta.url)
const useReal = existsSync(realUrl)
const source = useReal ? realUrl : exampleUrl
console.log(`Fuente: ${useReal ? 'cv.json (real)' : 'cv.example.json (template)'}`)

const raw = await readFile(source, 'utf8')
const cv: Json = JSON.parse(raw)

const nullable = (v: unknown) => (v === '' || v == null ? null : String(v))

await db.transaction(async (tx) => {
   // Orden FK-safe (hijos primero)
   await tx.delete(schema.workHighlights)
   await tx.delete(schema.projectHighlights)
   await tx.delete(schema.work)
   await tx.delete(schema.projects)
   await tx.delete(schema.education)
   await tx.delete(schema.skills)
   await tx.delete(schema.languages)
   await tx.delete(schema.profiles)
   await tx.delete(schema.basics)

   const b = cv.basics ?? {}
   const loc = b.location ?? {}
   await tx.insert(schema.basics).values({
      name: b.name ?? '',
      label: b.label ?? '',
      image: b.image ?? '',
      email: b.email ?? '',
      phone: b.phone ?? '',
      url: b.url ?? '',
      summary: b.summary ?? '',
      address: loc.address ?? '',
      postalCode: loc.postalCode ?? '',
      city: loc.city ?? '',
      countryCode: loc.countryCode ?? '',
      region: loc.region ?? '',
   })

   const profiles = (b.profiles ?? []) as Json[]
   if (profiles.length) {
      await tx.insert(schema.profiles).values(
         profiles.map((p, i) => ({
            network: p.network ?? '',
            username: p.username ?? '',
            url: p.url ?? '',
            sortOrder: i,
         })),
      )
   }

   const work = (cv.work ?? []) as Json[]
   for (const [i, w] of work.entries()) {
      const [row] = await tx
         .insert(schema.work)
         .values({
            name: w.name ?? '',
            position: w.position ?? '',
            url: nullable(w.url),
            startDate: nullable(w.startDate),
            endDate: nullable(w.endDate),
            summary: w.summary ?? '',
            sortOrder: i,
         })
         .returning({ id: schema.work.id })
      const hs = (w.highlights ?? []) as string[]
      if (hs.length) {
         await tx.insert(schema.workHighlights).values(
            hs.map((t, j) => ({ workId: row.id, text: t, sortOrder: j })),
         )
      }
   }

   const education = (cv.education ?? []) as Json[]
   if (education.length) {
      await tx.insert(schema.education).values(
         education.map((e, i) => ({
            institution: e.institution ?? '',
            url: nullable(e.url),
            area: e.area ?? '',
            studyType: e.studyType ?? '',
            startDate: nullable(e.startDate),
            endDate: nullable(e.endDate),
            score: e.score ?? '',
            sortOrder: i,
         })),
      )
   }

   const projects = (cv.projects ?? []) as Json[]
   for (const [i, p] of projects.entries()) {
      const [row] = await tx
         .insert(schema.projects)
         .values({
            name: p.name ?? '',
            isActive: Boolean(p.isActive),
            description: p.description ?? '',
            url: p.url ?? '',
            github: nullable(p.github),
            sortOrder: i,
         })
         .returning({ id: schema.projects.id })
      const hs = (p.highlights ?? []) as string[]
      if (hs.length) {
         await tx.insert(schema.projectHighlights).values(
            hs.map((t, j) => ({ projectId: row.id, text: t, sortOrder: j })),
         )
      }
   }

   const skills = (cv.skills ?? []) as Json[]
   if (skills.length) {
      await tx.insert(schema.skills).values(
         skills.map((s, i) => ({
            name: s.name ?? '',
            description: s.description ?? '',
            sortOrder: i,
         })),
      )
   }

   const languages = (cv.languages ?? []) as Json[]
   if (languages.length) {
      await tx.insert(schema.languages).values(
         languages.map((l, i) => ({
            language: l.language ?? '',
            fluency: l.fluency ?? '',
            sortOrder: i,
         })),
      )
   }
})

console.log('✓ Seed completado: CV cargado en Postgres')
process.exit(0)
