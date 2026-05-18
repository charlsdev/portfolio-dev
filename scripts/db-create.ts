import 'dotenv/config'
import postgres from 'postgres'

// Crea la base de datos `portfolio` en el servidor si no existe.
// Se conecta a la BD de mantenimiento `postgres` (no a `rim`).
const target = process.env.POSTGRES_DB ?? 'portfolio'

const sql = postgres({
   host: process.env.POSTGRES_HOST,
   port: Number(process.env.POSTGRES_PORT ?? 5432),
   user: process.env.POSTGRES_USER,
   password: process.env.POSTGRES_PASSWORD,
   database: 'postgres',
   ssl:
      (process.env.POSTGRES_SSL ?? 'disable').toLowerCase() === 'require'
         ? 'require'
         : (process.env.POSTGRES_SSL ?? 'disable').toLowerCase() === 'no-verify'
           ? { rejectUnauthorized: false }
           : false,
})

const exists = await sql`SELECT 1 FROM pg_database WHERE datname = ${target}`
if (exists.length > 0) {
   console.log(`✓ La base "${target}" ya existe`)
} else {
   await sql.unsafe(`CREATE DATABASE "${target}"`)
   console.log(`✓ Base "${target}" creada`)
}

await sql.end()
