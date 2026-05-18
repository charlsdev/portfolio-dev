# Despliegue (Dokploy + Dockerfile)

Stack: **SvelteKit 2 + Svelte 5**, SSR con `@sveltejs/adapter-node`, datos en
**PostgreSQL** (Drizzle). Panel admin en `/admin`.

## Base de datos

Se usa el servidor Postgres compartido (mismas credenciales que rim-pub) pero
una base **dedicada** `portfolio` — NO la base `rim`.

Las tablas se crean/actualizan con **drizzle-kit push** (NO hay migraciones
generadas; el schema TS en `src/lib/server/db/schema.ts` es la fuente de verdad):

```bash
pnpm exec tsx scripts/db-create.ts   # crea la base 'portfolio' si no existe
pnpm db:push                         # crea/sincroniza tablas (incl. users)
pnpm db:seed                         # carga inicial: src/cv.json si existe, si no cv.example.json
pnpm user:create <cedula> "<nombres y apellidos>" <password>  # imprime el INSERT del 1er usuario
```

El login es contra la tabla `users` (cédula + contraseña argon2id). No hay
credenciales en env. El primer usuario se crea corriendo el `INSERT` que
imprime `user:create`; el resto se gestiona desde `/admin/users`.

`db:push` y `db:seed` se corren **una vez** (localmente o en un one-off),
apuntando a la misma DB de producción. El contenedor de runtime NO los corre
(tsx/drizzle-kit son devDependencies).

## Variables de entorno (runtime, en Dokploy)

| Variable | Ejemplo | Notas |
|---|---|---|
| `POSTGRES_HOST` | `143.244.148.52` | servidor compartido |
| `POSTGRES_PORT` | `7000` | |
| `POSTGRES_USER` | `postgres` | |
| `POSTGRES_PASSWORD` | `********` | |
| `POSTGRES_DB` | `portfolio` | base dedicada, no `rim` |
| `POSTGRES_SSL` | `disable` | `disable` \| `no-verify` \| `require` |
| `SESSION_SECRET` | `<64 hex>` | clave de firma de la cookie (no es un usuario). `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ORIGIN` | `https://charlsdev.xyz` | **OBLIGATORIO** (ver abajo) |
| `NODE_ENV` | `production` | ya viene del Dockerfile |
| `PORT` | `3000` | ya viene del Dockerfile |

### ⚠️ `ORIGIN` es obligatorio

adapter-node valida CSRF en los POST de formularios comparando el header
`Origin` contra su origin público. Detrás del proxy de Dokploy ese origin no se
infiere solo: si `ORIGIN` no está seteado al dominio público real, **todos los
envíos del panel admin fallan con `403 Cross-site POST form submissions are
forbidden`** (el sitio público sí carga). Setealo al dominio con esquema, sin
slash final: `https://charlsdev.xyz`.

## Dokploy

1. Tipo de app: **Dockerfile** (NO Nixpacks — rompería adapter-node).
2. Cargar todas las env vars de la tabla.
3. Deploy. El `HEALTHCHECK` pega a `http://127.0.0.1:3000/`; si cambiás el
   comportamiento de `/` a un no-2xx, el contenedor queda *unhealthy*.
4. Apuntar el dominio público y verificar que `ORIGIN` coincide exactamente.

## Notas

- El logout borra la cookie del navegador; el token de sesión es stateless
  (HMAC con expiración de 7 días), así que un token ya capturado sigue válido
  hasta expirar. Aceptable para un admin de un solo usuario.
- La imagen del perfil (`basics.image`) es una ruta a `/static` o una URL
  absoluta. Subida de imágenes a la DB queda como iteración futura.
