<div align="center">
   <img src="./static/logo_primary.svg" height="80" width="auto" alt="charlsdev" />
   <h2><em>Portafolio</em> dinámico — SvelteKit + PostgreSQL</h2>
   <p>SSR · panel admin · light/dark · export a PDF · esquema</p>
</div>

Portafolio personal: el CV vive en **PostgreSQL** y se edita desde `/admin`
sin redeploy. Renderiza con SSR (SEO real) y exporta a PDF.

## 🛠️ Stack

- **SvelteKit 2 + Svelte 5 (runes)** — SSR vía `@sveltejs/adapter-node`.
- **Tailwind v4** (CSS-first, tokens de marca en `@theme`) + tema **light/dark**.
- **PostgreSQL + Drizzle** (`postgres.js`, cliente lazy). Schema TS, sin migraciones (`db:push`).
- **Auth** contra tabla `users` (cédula + **argon2id**), sin credenciales en env.
- **TypeScript** en todo · estándar `pnpm check` en 0/0.

## 🗺️ Mapa del proyecto

| Ruta | Qué es |
|---|---|
| `src/routes/+page.svelte` · `+page.server.ts` | Sitio público. El `load` arma el CV desde la DB |
| `src/routes/cv/` | Documento A4 imprimible (botón "Descargar PDF" → `window.print()`) |
| `src/routes/admin/*` | Panel: login, dashboard, CRUD por sección, `/admin/users` |
| `src/lib/components` · `icons` · `layout` | UI del portfolio + `ThemeToggle` |
| `src/lib/cv-context.ts` | Inyecta el CV en contexto SSR-safe; cada sección usa `getCv()` |
| `src/lib/forms.ts` | `enhanceKeep` — `enhance` sin reset (forms de edición) |
| `src/app.css` · `src/app.html` | Tokens Tailwind `@theme` + script anti-FOUC del tema |
| `src/lib/server/cv-source.ts` | Único punto de lectura: DB → objeto `Root` (JSON Resume) |
| `src/lib/server/cv-repo.ts` · `users-repo.ts` | CRUD del admin (contenido / usuarios) |
| `src/lib/server/db/{schema,index}.ts` | Schema Drizzle relacional + cliente lazy |
| `src/lib/server/auth.ts` · `src/hooks.server.ts` | argon2id + cookie firmada + guard `/admin` |
| `scripts/*` | `db-create`, `seed`, `user-create`, `user-passwd` |

## 🚀 Desarrollo

```bash
pnpm install
cp .env.example .env                  # completar Postgres + SESSION_SECRET

pnpm exec tsx scripts/db-create.ts    # crea la base 'portfolio'
pnpm db:push                          # crea las tablas (incl. users)
pnpm db:seed                          # carga el CV (src/cv.json o cv.example.json)

# Primer usuario admin (imprime el INSERT con el hash; correlo en tu SQL):
pnpm user:create <cedula> "<nombres y apellidos>" <password>

pnpm dev                              # http://localhost:4000
```

Panel: `http://localhost:4000/admin` — login por **cédula + contraseña**.
El resto de usuarios se gestionan desde `/admin/users` (sin SQL).

## 📦 Scripts

| Script | Acción |
|---|---|
| `pnpm dev` | Dev server (puerto 4000) |
| `pnpm build` / `pnpm start` | Build adapter-node / servirlo |
| `pnpm check` | `svelte-kit sync` + `svelte-check` |
| `pnpm db:push` | Sincroniza schema TS → Postgres |
| `pnpm db:seed` | Carga/reset del CV desde `src/cv.json` (o `cv.example.json`) |
| `pnpm db:studio` | Drizzle Studio |
| `pnpm user:create <ced> "<nombres>" <pass>` | Imprime el `INSERT` del 1er usuario |
| `pnpm user:passwd <ced> <pass>` | Imprime el `UPDATE` para cambiar una clave |

## 📚 Documentación

| Doc | Contenido |
|---|---|
| [CLAUDE.md](CLAUDE.md) · [AGENTS.md](AGENTS.md) | Notas para agentes (stack, gotchas, convenciones) |
| [AUTH.md](AUTH.md) | Auth por tabla `users`: sesión, argon2id, revocación, bootstrap |
| [DEPLOY.md](DEPLOY.md) | Dokploy/Docker, env vars (ojo con **`ORIGIN`**) |
| [MARCA.md](MARCA.md) | Sistema de diseño (colores, tipografía, tokens) |

## 🌐 Despliegue

**Dokploy con Dockerfile** (NO Nixpacks). Env solo en runtime.
**`ORIGIN` es obligatorio** o los POST del admin dan 403 tras el proxy.
Detalle completo en **[DEPLOY.md](DEPLOY.md)**.

## 🔑 Licencia

[MIT](LICENSE) — [**charlsdev**](https://charlsdev.xyz).
