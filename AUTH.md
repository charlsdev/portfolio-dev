# AUTH — Panel admin (tabla `users`)

> El panel `/admin` autentica contra la tabla **`users`** de Postgres por
> **cédula + contraseña** (argon2id). **No hay credenciales en env.** Todos
> los usuarios activos tienen acceso total (sin RBAC).

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│ Cookie del browser:                                         │
│   admin_session = base64url("<userId>.<issuedAt>") . HMAC   │
│   httpOnly · sameSite=lax · secure(prod) · maxAge 7d        │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ src/lib/server/auth.ts                                      │
│   hashPassword / verifyPassword   → argon2id (@node-rs)      │
│   createSessionToken(userId)      → firma HMAC(SESSION_SECRET)│
│   parseSession(token)             → userId | null (firma+exp)│
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ src/hooks.server.ts (cada request)                          │
│   1. parseSession(cookie) → userId                          │
│   2. getActiveUserById(userId)  ← DB: existe Y is_active     │
│   3. locals.user / locals.admin                             │
│   4. guard: /admin/* sin sesión → /admin/login              │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
        +layout.server.ts (defensa en profundidad) · /admin/*
```

---

## Conceptos clave

### La cookie NO es la verdad — la DB sí
`parseSession()` solo prueba que el token está **firmado y no expiró**. La
autorización real la decide [src/hooks.server.ts](src/hooks.server.ts)
consultando `getActiveUserById()`: si el usuario fue **eliminado o
desactivado**, la sesión deja de valer **al instante** (sin esperar los 7
días). Es una query por request a una tabla chica e indexada — aceptable.

### Password: argon2id
`@node-rs/argon2` (binarios precompilados napi-rs; trae musl para el Alpine
del Docker, sin toolchain de compilación). Hash con `hashPassword()`,
verificación timing-safe con `verifyPassword()`. Formato `$argon2id$...`.

### Sin credenciales en env
Solo existe `SESSION_SECRET` (clave de firma de la cookie, **no** un
usuario; mín. 16 chars, sin él el panel tira 500). No hay
`ADMIN_USERNAME/PASSWORD`.

### Sin RBAC
Todos los usuarios con `is_active = true` = admin total (editan contenido y
gestionan usuarios). No hay roles ni matriz de permisos. Si algún día se
necesitan roles, agregar columna `role` + gates en hooks/layout (por eso
**no** hay `RBAC.md` como en rim-pub).

---

## Tabla `users`

[src/lib/server/db/schema.ts](src/lib/server/db/schema.ts)

| Columna | Tipo | Nota |
|---|---|---|
| `id` | serial PK | |
| `cedula` | text **unique** | identificador de login |
| `full_name` | text | nombres y apellidos (se muestra en el sidebar) |
| `password_hash` | text | argon2id |
| `is_active` | boolean (def. true) | desactivar = revocar acceso sin borrar |
| `created_at` | timestamptz | |

CRUD en [src/lib/server/users-repo.ts](src/lib/server/users-repo.ts). El
`passwordHash` nunca sale de ahí (`SAFE` projection sin el hash).

---

## Bootstrap del primer usuario (huevo/gallina)

Sin usuarios no se puede entrar a crear usuarios. Se resuelve por **CLI que
imprime el SQL** (no hay página de setup pública):

```bash
pnpm user:create <cedula> "<nombres y apellidos>" <password>
# → imprime: INSERT INTO users (cedula, full_name, password_hash, is_active) VALUES (...);
```

Se corre ese `INSERT` a mano en la base `portfolio`. El resto de usuarios se
gestionan desde **`/admin/users`** (alta, activar/desactivar, cambiar clave,
eliminar) — sin SQL.

Cambio de clave de un usuario existente por CLI:

```bash
pnpm user:passwd <cedula> <nueva-password>   # imprime el UPDATE
```

---

## Rutas y guards

- [src/hooks.server.ts](src/hooks.server.ts) — guard global: `/admin` y
  `/admin/*` (excepto `/admin/login`) requieren sesión; si ya hay sesión y
  vas a `/admin/login` → redirige a `/admin`.
- [src/routes/admin/+layout.server.ts](src/routes/admin/+layout.server.ts) —
  defensa en profundidad (cubre rutas admin nuevas) + expone `me`.
- [src/routes/admin/login/+page.server.ts](src/routes/admin/login/+page.server.ts)
  — action: `getUserByCedula` + `verifyPassword`, setea la cookie.
- [src/routes/admin/logout/+server.ts](src/routes/admin/logout/+server.ts) —
  POST: borra la cookie. (Stateless: un token ya capturado sigue válido
  hasta expirar/desactivar al usuario; aceptable para este alcance.)
- [src/routes/admin/users/](src/routes/admin/users/) — gestión. Guard
  anti-lockout: **no podés desactivar ni eliminar tu propia cuenta**.

---

## Notas de seguridad

- **`ORIGIN` obligatorio en prod**: adapter-node valida CSRF de los POST de
  formularios contra el origin público. Sin `ORIGIN=https://dominio`, todos
  los POST del admin (login incluido) dan **403**. Ver [DEPLOY.md](DEPLOY.md).
- `SESSION_SECRET` fuerte y estable. Si cambia, todas las sesiones se
  invalidan (las firmas dejan de validar).
- Cookie `secure` solo en producción (`NODE_ENV=production`), `httpOnly`,
  `sameSite=lax`.
- Validación timing-safe en firma y password (no se filtra qué falló).
