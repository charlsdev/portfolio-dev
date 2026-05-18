import { redirect } from '@sveltejs/kit'
import { SESSION_COOKIE } from '@/server/auth'
import type { RequestHandler } from './$types'

// Endpoint puro (sin página): el form del layout hace POST aquí.
export const POST: RequestHandler = ({ cookies }) => {
   cookies.delete(SESSION_COOKIE, { path: '/' })
   throw redirect(303, '/admin/login')
}

export const GET: RequestHandler = () => {
   throw redirect(303, '/admin')
}
