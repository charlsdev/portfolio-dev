import { createHmac, timingSafeEqual } from 'node:crypto'
import { hash as argonHash, verify as argonVerify } from '@node-rs/argon2'

// Auth multi-usuario contra la tabla `users`. Password con argon2id
// (@node-rs/argon2, binarios precompilados). Sesión en cookie firmada con
// HMAC que lleva el userId; la validación real (existe + activo) la hace
// hooks.server.ts.

export const SESSION_COOKIE = 'admin_session'
const MAX_AGE_S = 60 * 60 * 24 * 7 // 7 días

function secret(): string {
   const s = process.env.SESSION_SECRET
   if (!s || s.length < 16) {
      throw new Error('SESSION_SECRET ausente o muy corto (mín. 16 chars)')
   }
   return s
}

/* ---------- Password (argon2id) ---------- */

export function hashPassword(password: string): Promise<string> {
   return argonHash(password)
}

export async function verifyPassword(
   password: string,
   stored: string,
): Promise<boolean> {
   if (!stored) return false
   try {
      return await argonVerify(stored, password)
   } catch {
      return false
   }
}

/* ---------- Session token (HMAC) ---------- */

function sign(payload: string): string {
   return createHmac('sha256', secret()).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string): boolean {
   const ab = Buffer.from(a)
   const bb = Buffer.from(b)
   return ab.length === bb.length && timingSafeEqual(ab, bb)
}

export function createSessionToken(userId: number): string {
   const payload = `${userId}.${Date.now()}`
   return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`
}

// Devuelve el userId si la firma es válida y no expiró; si no, null.
export function parseSession(token: string | undefined): number | null {
   if (!token) return null
   const [b64, sig] = token.split('.')
   if (!b64 || !sig) return null
   const payload = Buffer.from(b64, 'base64url').toString('utf8')
   if (!safeEqual(sig, sign(payload))) return null
   const [idStr, tsStr] = payload.split('.')
   const id = Number(idStr)
   const issuedAt = Number(tsStr)
   if (!Number.isInteger(id) || !Number.isFinite(issuedAt)) return null
   if (Date.now() - issuedAt >= MAX_AGE_S * 1000) return null
   return id
}

export const sessionCookieOptions = {
   path: '/',
   httpOnly: true,
   sameSite: 'lax' as const,
   secure: process.env.NODE_ENV === 'production',
   maxAge: MAX_AGE_S,
}
