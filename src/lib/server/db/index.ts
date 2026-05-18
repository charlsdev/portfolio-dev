import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export { schema }

type Ssl = false | 'require' | { rejectUnauthorized: false }

function sslFromEnv(mode: string | undefined): Ssl {
   switch ((mode ?? 'disable').toLowerCase()) {
      case 'require':
         return 'require'
      case 'no-verify':
         return { rejectUnauthorized: false }
      default:
         return false
   }
}

function connect(): PostgresJsDatabase<typeof schema> {
   const {
      POSTGRES_HOST,
      POSTGRES_PORT,
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_DB,
      POSTGRES_SSL,
   } = process.env

   if (!POSTGRES_HOST || !POSTGRES_USER || !POSTGRES_DB) {
      throw new Error(
         'Faltan variables de Postgres (POSTGRES_HOST/USER/DB). Revisá tu .env',
      )
   }

   const sql = postgres({
      host: POSTGRES_HOST,
      port: Number(POSTGRES_PORT ?? 5432),
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      ssl: sslFromEnv(POSTGRES_SSL),
      // El cliente fija la sesión en UTC (convención de la org).
      connection: { timezone: 'UTC' },
   })

   return drizzle(sql, { schema })
}

// Lazy: NO conectar al importar el módulo. El build de SvelteKit importa
// módulos de servidor para bundlear; conectar en top-level reventaría sin
// env vars. Se conecta en la primera query (request / script).
let _db: PostgresJsDatabase<typeof schema> | null = null

export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
   get(_t, prop) {
      _db ??= connect()
      return Reflect.get(_db, prop, _db)
   },
})
