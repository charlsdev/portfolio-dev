import { asc, eq } from 'drizzle-orm'
import { hashPassword } from './auth'
import { db, schema } from './db'

export type SafeUser = {
   id: number
   cedula: string
   fullName: string
   isActive: boolean
   createdAt: Date
}

const SAFE = {
   id: schema.users.id,
   cedula: schema.users.cedula,
   fullName: schema.users.fullName,
   isActive: schema.users.isActive,
   createdAt: schema.users.createdAt,
}

export const listUsers = (): Promise<SafeUser[]> =>
   db.select(SAFE).from(schema.users).orderBy(asc(schema.users.createdAt))

export async function getUserByCedula(cedula: string) {
   const [u] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.cedula, cedula))
      .limit(1)
   return u ?? null
}

export async function getActiveUserById(id: number): Promise<SafeUser | null> {
   const [u] = await db.select(SAFE).from(schema.users).where(eq(schema.users.id, id)).limit(1)
   return u && u.isActive ? u : null
}

export async function createUser(cedula: string, fullName: string, password: string) {
   await db.insert(schema.users).values({
      cedula: cedula.trim(),
      fullName: fullName.trim(),
      passwordHash: await hashPassword(password),
   })
}

export const setUserActive = (id: number, isActive: boolean) =>
   db.update(schema.users).set({ isActive }).where(eq(schema.users.id, id))

export async function setUserPassword(id: number, password: string) {
   await db
      .update(schema.users)
      .set({ passwordHash: await hashPassword(password) })
      .where(eq(schema.users.id, id))
}

export const deleteUser = (id: number) =>
   db.delete(schema.users).where(eq(schema.users.id, id))

export async function countUsers(): Promise<number> {
   return db.$count(schema.users)
}
