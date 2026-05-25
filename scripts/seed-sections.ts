import 'dotenv/config'
import { listSections, seedSections } from '../src/lib/server/sections-repo.ts'

// Inserta las filas de configuración de secciones que falten (idempotente,
// NO toca el contenido). Correr una vez tras crear/actualizar la tabla.
await seedSections()
const rows = await listSections()
console.log('Secciones:', rows.map((r) => `${r.sortOrder}:${r.key}${r.inDev ? '*' : ''}`).join('  '))
console.log('(* = visible en modo Dev)')
process.exit(0)
