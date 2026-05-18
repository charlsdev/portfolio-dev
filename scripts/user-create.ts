import 'dotenv/config'
import { hash } from '@node-rs/argon2'

// Genera el INSERT (con el hash argon2 ya calculado) para crear un usuario
// del panel. NO toca la DB: imprime el SQL para que lo corras vos.
//
//   pnpm user:create <cedula> "<nombres y apellidos>" <password>
//
// Ej: pnpm user:create 0102030405 "Carlos Villacreses" MiClave123

const [cedula, fullName, password] = process.argv.slice(2)

if (!cedula || !fullName || !password) {
   console.error(
      'Uso: pnpm user:create <cedula> "<nombres y apellidos>" <password>',
   )
   process.exit(1)
}
if (password.length < 6) {
   console.error('La contraseña debe tener al menos 6 caracteres.')
   process.exit(1)
}

const sqlStr = (s: string) => `'${s.replace(/'/g, "''")}'`
const passwordHash = await hash(password)

console.log('\n-- Copiá y ejecutá esto en tu cliente SQL (base "portfolio"):\n')
console.log(
   `INSERT INTO users (cedula, full_name, password_hash, is_active)\n` +
      `VALUES (${sqlStr(cedula)}, ${sqlStr(fullName)}, ${sqlStr(passwordHash)}, true);\n`,
)
process.exit(0)
