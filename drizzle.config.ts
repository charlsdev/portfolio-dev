import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const ssl =
   (process.env.POSTGRES_SSL ?? 'disable').toLowerCase() === 'require'
      ? 'require'
      : (process.env.POSTGRES_SSL ?? 'disable').toLowerCase() === 'no-verify'
        ? { rejectUnauthorized: false }
        : false

export default defineConfig({
   dialect: 'postgresql',
   schema: './src/lib/server/db/schema.ts',
   out: './drizzle',
   dbCredentials: {
      host: process.env.POSTGRES_HOST!,
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      user: process.env.POSTGRES_USER!,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB!,
      ssl,
   },
   strict: false,
   verbose: false,
})
