import { asc, eq } from 'drizzle-orm'
import { SECTION_DEFS } from '@/sections'
import { db, schema } from './db'

export type SectionRow = {
   id: number
   key: string
   label: string
   sortOrder: number
   inDev: boolean
}

// Inserta las secciones faltantes (idempotente). Las que ya existen no se tocan
// (conserva el orden / flag Dev que el admin haya configurado).
export async function seedSections() {
   await db
      .insert(schema.sections)
      .values(
         SECTION_DEFS.map((d, i) => ({
            key: d.key,
            label: d.label,
            sortOrder: i,
            inDev: d.inDev,
         })),
      )
      .onConflictDoNothing({ target: schema.sections.key })
}

export const listSections = (): Promise<SectionRow[]> =>
   db.select().from(schema.sections).orderBy(asc(schema.sections.sortOrder))

export const reorderSections = (ids: number[]) =>
   db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++)
         await tx
            .update(schema.sections)
            .set({ sortOrder: i })
            .where(eq(schema.sections.id, ids[i]))
   })

export const setSectionDev = (id: number, inDev: boolean) =>
   db.update(schema.sections).set({ inDev }).where(eq(schema.sections.id, id))
