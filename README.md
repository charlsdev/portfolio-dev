<div align="center">
   <img src="./static/logo_primary.svg" height="80" width="auto" alt="charlsdev" />
   <h2><em>Portafolio</em> dinámico — SvelteKit + PostgreSQL</h2>
   <p>SSR · panel admin · light/dark · export a PDF · modo Dev / Completo</p>
</div>

Portafolio personal: el CV vive en **PostgreSQL** y se edita desde `/admin`
sin redeploy. Renderiza con SSR (SEO real), exporta a PDF y permite alternar
entre una vista **Dev** (developer-focused) y **Completo** (con secciones
académicas).

## 🛠️ Stack

- **SvelteKit 2 + Svelte 5 (runes)** — SSR vía `@sveltejs/adapter-node`.
- **Tailwind v4** (CSS-first, tokens de marca en `@theme`) + **light/dark**.
- **PostgreSQL + Drizzle** (`postgres.js`, cliente lazy). Schema TS, sin migraciones (`db:push`).
- **Auth** contra tabla `users` (cédula + **argon2id**), sin credenciales en env.
- **Drag & drop** para reordenar (`svelte-dnd-action`).
- **TypeScript** en todo · estándar `pnpm check` en **0/0**.

## ✨ Funcionalidades

- **Sitio público** (SSR) con secciones renderizadas dinámicamente por
  configuración: Sobre mí, Experiencia, Proyectos, Estudios, Cursos,
  Ponencias, Publicaciones, Investigaciones, Méritos, Habilidades.
- **Modo Dev / Completo**: toggle en el sitio + descarga del PDF en el modo
  elegido. "Dev" oculta secciones académicas; "Completo" muestra todo.
- **PDF** del CV vectorial (`/cv?mode=dev|completo`) — A4, secciones que
  fluyen entre páginas sin huecos, ítems individuales sin partir.
- **Panel admin** con:
  - Lista compacta + **drawer lateral** para crear/editar.
  - **Drag & drop** para reordenar (auto-guardado optimista).
  - **Eliminar con confirmación** dentro del drawer.
  - Gestión de **usuarios** y **orden de secciones** (con flag Dev).
- **Tema light/dark** con anti-FOUC.
- **Sesión** revocable al instante (desactivar usuario corta acceso).

## 🗺️ Mapa del proyecto

| Ruta | Qué es |
|---|---|
| `src/routes/+page.svelte` · `+page.server.ts` | Sitio público. Topbar con toggle Dev/Completo + tema. Render dinámico de secciones |
| `src/routes/cv/` | Documento A4 imprimible (`?mode=dev|completo`) |
| `src/routes/admin/*` | Panel: login, dashboard, CRUD por sección, `/admin/users`, `/admin/sections` |
| `src/lib/components` | Secciones del CV + `EntityManager`, `Drawer`, `SortableList`, `ThemeToggle` |
| `src/lib/layout` | `Section.svelte` (wrapper con título e índice), `Footer.svelte` |
| `src/lib/cv-context.ts` | Inyecta el CV en contexto SSR-safe; cada sección usa `getCv()` |
| `src/lib/sections.ts` | Registro canónico `SECTION_DEFS` (keys, labels, defaults Dev) |
| `src/lib/forms.ts` | `enhanceKeep` — `enhance` sin reset para forms pre-cargados inline |
| `src/app.css` · `src/app.html` | Tokens Tailwind `@theme` + script anti-FOUC del tema |
| `src/lib/server/cv-source.ts` | Único punto de lectura: DB → objeto `Root` |
| `src/lib/server/cv-repo.ts` · `users-repo.ts` · `sections-repo.ts` | CRUD del admin |
| `src/lib/server/db/{schema,index}.ts` | Schema Drizzle + cliente lazy |
| `src/lib/server/auth.ts` · `src/hooks.server.ts` | argon2id + cookie firmada + guard `/admin` |
| `scripts/*` | `db-create`, `seed`, `seed-sections`, `user-create`, `user-passwd` |

### Componentes clave del admin

- **`EntityManager.svelte`** — genérico `<T extends {id:number}>`. Orquesta
  lista compacta + reorder + drawer crear/editar/eliminar + cierre tras éxito.
  Cada página solo provee 2 snippets (`row` y `fields`).
- **`Drawer.svelte`** — panel lateral derecho accesible (focus trap, Esc,
  scroll-lock, `role="dialog"`).
- **`SortableList.svelte`** — drag & drop genérico con handle, auto-guardado
  optimista al soltar.

## 🚀 Desarrollo

```bash
pnpm install
cp .env.example .env                  # completar Postgres + SESSION_SECRET

pnpm exec tsx scripts/db-create.ts    # crea la base 'portfolio'
pnpm db:push                          # crea las tablas (incl. users, sections)
pnpm db:seed                          # carga el CV (src/cv.json o cv.example.json)
pnpm exec tsx scripts/seed-sections.ts # siembra config de secciones (idempotente)

# Primer usuario admin (imprime el INSERT con el hash; correlo en tu SQL):
pnpm user:create <cedula> "<nombres y apellidos>" <password>

pnpm dev                              # http://localhost:4000
```

Panel: `http://localhost:4000/admin` — login por **cédula + contraseña**.
El resto de usuarios y la **configuración de secciones** se gestionan desde
`/admin/users` y `/admin/sections` (sin SQL).

## 📦 Scripts

| Script | Acción |
|---|---|
| `pnpm dev` | Dev server (puerto 4000) |
| `pnpm build` / `pnpm start` | Build adapter-node / servirlo |
| `pnpm check` | `svelte-kit sync` + `svelte-check` (estándar: 0 errores / 0 warnings) |
| `pnpm db:push` | Sincroniza schema TS → Postgres |
| `pnpm db:seed` | Carga/reset del CV desde `src/cv.json` (o `cv.example.json`) |
| `pnpm db:studio` | Drizzle Studio |
| `pnpm user:create <ced> "<nombres>" <pass>` | Imprime el `INSERT` del 1er usuario |
| `pnpm user:passwd <ced> <pass>` | Imprime el `UPDATE` para cambiar una clave |
| `pnpm exec tsx scripts/seed-sections.ts` | Siembra la config de `sections` (idempotente; también auto-corre al abrir `/admin/sections`) |

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
