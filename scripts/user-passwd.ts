import 'dotenv/config'
import { hash } from '@node-rs/argon2'

// Genera el UPDATE (hash argon2 ya calculado) para cambiar la contraseña
// de un usuario existente. NO toca la DB: imprime el SQL.
//
//   pnpm user:passwd <cedula> <nueva-password>

const [cedula, password] = process.argv.slice(2)

if (!cedula || !password) {
   console.error('Uso: pnpm user:passwd <cedula> <nueva-password>')
   process.exit(1)
}
if (password.length < 6) {
   console.error('La contraseña debe tener al menos 6 caracteres.')
   process.exit(1)
}

const sqlStr = (s: string) => `'${s.replace(/'/g, "''")}'`
const passwordHash = await hash(password)

console.log('\n-- Ejecutá esto en tu cliente SQL (base "portfolio"):\n')
console.log(
   `UPDATE users SET password_hash = ${sqlStr(passwordHash)} ` +
      `WHERE cedula = ${sqlStr(cedula)};\n`,
)
process.exit(0)
