@AGENTS.md

# Portfolio (charlsdev) — Notas para agentes

Portfolio personal con SSR + panel admin. El CV vive en **PostgreSQL** y se
edita desde `/admin`. Stack: **SvelteKit 2 + Svelte 5 (runes) + Tailwind v4 + Drizzle + argon2id**.

## Idioma y tono
- Texto user-facing (UI, errores, copy, badges): **español neutro**.
- Variables, comentarios técnicos, commits, PRs: **inglés** (salvo comentarios de lógica de negocio que valen más en español).
- Comentarios escuetos: solo el WHY no obvio. NO documentes lo que el nombre del símbolo ya dice.

## Stack que NO es lo común
- **SvelteKit 2 + Svelte 5 (runes)** con `@sveltejs/adapter-node` (SSR, NO sitio estático, NO custom server). Dev en puerto **4000**.
- **Tailwind v4** CSS-first: tokens en `@theme` dentro de [src/app.css](src/app.css), plugin `@tailwindcss/vite` en [vite.config.ts](vite.config.ts). **NO existe `tailwind.config.js`**.
- **pnpm** + Node por **fnm** (en shells no-interactivos `node`/`pnpm` no están en PATH; prependé el dir de la versión activa de fnm). `package.json` tiene `"packageManager": "pnpm@10.33.2"` para fijar la versión en Docker.
- **Drizzle + postgres.js**. NO Prisma. Cliente lazy en [src/lib/server/db/index.ts](src/lib/server/db/index.ts).
- **Alias `@` → `src/lib`** (definido en [svelte.config.js](svelte.config.js)). Ej: `@/components/...`, `@/server/...`. `$lib` también funciona.
- **argon2id vía `@node-rs/argon2`** (binarios precompilados napi-rs, sin toolchain de compilación; trae el binario musl para el Alpine del Docker). NO uses el paquete `argon2` (node-gyp).
- **Svelte 5 runes**: en componentes con `$props()`/`$state()`/`$derived()`, `<svelte:component>` está **deprecado** — usá `{@const C = ...}` + `<C />`.

## Build de producción — gotchas (no romper)
- `src/lib/server/db/index.ts` exporta `db` como **Proxy lazy**. NO lo hagas eager: el build de SvelteKit importa módulos de servidor sin env vars y reventaría al conectar.
- [vite.config.ts](vite.config.ts) hace `Object.assign(process.env, loadEnv(mode, cwd, ''))`. Es a propósito: en dev SvelteKit expone `.env` solo vía `$env`, pero `db/index.ts` y los scripts leen `process.env` (mismo código en dev, en prod con `node --env-file` y en Dokploy). NO lo borres.
- `package.json` arranca prod con `node --env-file-if-exists=.env build` (carga `.env` en local; en Dokploy las vars las inyecta la plataforma).
- **`ORIGIN` es OBLIGATORIO en prod**: adapter-node valida CSRF de los POST de formularios contra el origin público. Sin `ORIGIN=https://dominio` exacto, **todo POST del admin da 403** (el sitio público sí carga). Ver [DEPLOY.md](DEPLOY.md).
- Páginas con datos del `load` que se referencian en `<script>` → usar `$derived` (Svelte avisa `state_referenced_locally`). El estándar del repo es `check` con **0 errores / 0 warnings**.
- Dockerfile fija pnpm: `COREPACK_ENABLE_DOWNLOAD_PROMPT=0 && corepack prepare pnpm@10.33.2 --activate`. Sin el pin, corepack baja otra pnpm que aborta por "ignored build scripts" (`esbuild`, `@biomejs/biome` están en `pnpm.onlyBuiltDependencies`).

## Modo Dev / Completo + orden de secciones
- Tabla **[`sections`](src/lib/server/db/schema.ts)** (id, key, label, sort_order, in_dev). Registro canónico en **[src/lib/sections.ts](src/lib/sections.ts)** (`SECTION_DEFS`). Repo: [src/lib/server/sections-repo.ts](src/lib/server/sections-repo.ts) (`seedSections()` es idempotente, `listSections`, `reorderSections`, `setSectionDev`).
- **El público y el PDF renderizan las secciones dinámicamente** según el orden de la tabla. Cada sección recibe el `index` (01, 02…) como **prop**; el componente NO hardcodea el número, el padre lo calcula. NO pongas `{#if list.length}` dentro de los componentes — el padre filtra por `hasData(key)` y por modo, así la numeración no deja huecos.
- **Default Dev** en el público (toggle `Dev | Completo` en el topbar, estado client). **PDF**: `/cv?mode=dev|completo` (server). Footer público respeta el modo actual al linkear `/cv`.
- Admin: **[/admin/sections](src/routes/admin/sections/+page.svelte)** — drag&drop para orden + botón `En Dev ✓ / Solo Completo` por sección. La carga llama a `seedSections()` (idempotente), así fresh deploys arrancan solos.

## Admin — patrón UX (Drawer + EntityManager)
- Las listas (skills, work, education, projects, profiles, languages, courses, talks, publications, research, awards) usan **[EntityManager.svelte](src/lib/components/EntityManager.svelte)** — genérico `<T extends {id:number}>`. Renderiza lista compacta + botón "Añadir" + drawer lateral con form.
- Cada página solo define 2 snippets: `row(item)` (fila compacta) + `fields(item|undefined)` (inputs del form, reusados para crear y editar).
- **Drawer accesible**: [src/lib/components/Drawer.svelte](src/lib/components/Drawer.svelte) — panel desde la derecha, `role="dialog"`, Esc cierra, scroll-lock, focus al primer campo y restaurado al cerrar.
- **Eliminar** vive en el drawer con confirmación 2 pasos (anti-clic accidental).
- **Cierre tras éxito + invalidate**: una sola `use:enhance` en el form detecta delete vs create/update por `action.search`. En éxito hace `invalidateAll()` y cierra el drawer → la lista se refresca. Como el form se desmonta al cerrar, NO aplica el bug de `enhanceKeep` (los modales lo simplifican).
- **`basics`** es la excepción (form único pre-cargado, no lista) → usa `use:enhanceKeep` inline.

## Drag & drop para reordenar
- **[SortableList.svelte](src/lib/components/SortableList.svelte)** (genérico) + `svelte-dnd-action`. Handle de arrastre (⠿), auto-guardado **optimista** al soltar (POST a `?/reorder` con `ids` JSON, sin `invalidateAll` para no pisar inputs en edición).
- Cada lista tiene una acción `reorder` en su `+page.server.ts` que llama a `reorderX(ids)` del repo (`UPDATE sort_order = $idx` en transacción).
- Los `update` de cv-repo **NO tocan `sortOrder`** — solo el reorder lo escribe (así guardar un campo no resetea el orden).
- Sections también usa `SortableList` (las secciones tienen id serial para que SortableList genérico funcione).

## Forms del admin — gotcha de `use:enhance`
- El `use:enhance` por defecto, en éxito, hace `form.reset()`. Los forms de **edición** vienen pre-cargados con `value={...}` (propiedad, no atributo) → `reset()` los deja en blanco y, como el valor real no cambió, Svelte no los re-escribe → "se borra hasta refrescar".
- Solución: usar **`enhanceKeep`** ([src/lib/forms.ts](src/lib/forms.ts) → `update({ reset: false })`) en forms inline pre-cargados (hoy solo `basics` y la lista de `users`).
- En `EntityManager` el problema no aplica porque el form vive dentro del Drawer que se desmonta al cerrar.

## Auth — contra la tabla `users`
> Guía completa en [AUTH.md](AUTH.md). Léela antes de tocar login/sesión.
- Login por **cédula + contraseña** contra `users` (argon2id). **No hay credenciales en env** (solo `SESSION_SECRET`, que es clave de firma, no un usuario).
- Sesión = cookie firmada HMAC con el `userId`. [src/hooks.server.ts](src/hooks.server.ts) valida firma + que el usuario **exista y esté activo** (revocar = `is_active=false` corta el acceso al instante).
- Todos los usuarios activos = admin total (sin RBAC). Guard: no podés desactivar/eliminar tu propia cuenta.
- Gestión desde `/admin/users`. Bootstrap del primer usuario: `pnpm user:create <cedula> "<nombres>" <pass>` imprime el `INSERT` (con hash) para correr a mano. Cambio de clave: `pnpm user:passwd <cedula> <nueva>`.

## Base de datos
- Servidor Postgres **compartido con rim-pub** (mismas credenciales, host/puerto del .env) pero base **dedicada `portfolio`** — NUNCA la base `rim`.
- Tablas vía **`pnpm db:push`** (drizzle-kit). NO hay migraciones generadas: el schema TS en [src/lib/server/db/schema.ts](src/lib/server/db/schema.ts) es la fuente de verdad. `drizzle.config.ts` tiene `strict:false` para que `push` no pida TTY.
- Columnas de tiempo (`created_at`, `updated_at`): `timestamptz`. Las fechas de CV (work/education/courses) son **fechas de calendario → tipo `date`**, no timestamptz. Años (publications/awards/research): `integer` nullable.
- Relaciones con `ON DELETE CASCADE` (highlights de work/projects).
- Tablas del CV: `basics, profiles, work(+highlights), education, projects(+highlights), skills, languages, courses, talks, publications, awards, research`. Más: `users` (auth) y `sections` (config orden + Dev/Completo).

## Modelo del CV y secciones
- Único punto de lectura: [src/lib/server/cv-source.ts](src/lib/server/cv-source.ts) (`loadCv()` arma `Root` desde la DB). Componentes vía contexto: `setCv()` en `+page.svelte`, `getCv()` en cada sección ([src/lib/cv-context.ts](src/lib/cv-context.ts)).
- Tipos en [src/lib/cv.ts](src/lib/cv.ts) (`Root` extendido con `courses, talks, publications, research, awards`).
- **Secciones del público** (10): about, experience, education, projects, courses, talks, publications, research, awards, skills. Languages vive en el hero (Profile, no en `sections`).
- Cada componente de sección acepta `let { index = '' } = $props()` y se lo pasa al `<Section>`. NO hardcodean número ni dejan internal `{#if list.length}` — el padre filtra.
- Modelo relacional por sección + `sort_order` editable. `highlights` de work/projects se editan como textarea (1 por línea), no CRUD anidado.
- **Las 5 secciones académicas** (courses, talks, publications, research, awards) usan **formato ficha** (`<dl>` con `<dt>`/`<dd>`) con badges `.vbadge` reutilizables (`vbadge-amber`, `vbadge-mono`) definidas en [src/app.css](src/app.css). Convención de color: Institución = ámbar texto en algunas / normal en otras (ver cada componente); años/fechas = badge ámbar-mono.
- Seed: `pnpm db:seed` vacía y recarga el CV. Fuente: `src/cv.json` (real, gitignored) si existe; si no `src/cv.example.json` (template del repo). **NO toca `sections` ni `users`**.
- `pnpm exec tsx scripts/seed-sections.ts` siembra la config de secciones (idempotente). Auto-corre al abrir `/admin/sections`.

## Tema light/dark
- Atributo `data-theme` en `<html>`. Script anti-FOUC inline en [src/app.html](src/app.html) lo fija antes del primer paint (localStorage o `prefers-color-scheme`).
- Tokens semánticos (`--bg`, `--surface`, `--fg`, `--line`…) conmutan por `[data-theme="dark"]`; expuestos como utilidades Tailwind vía `@theme inline` (`bg-bg`, `text-fg`, `border-line`). Los tokens de marca son constantes (`bg-primary`, `text-accent`).
- Toggle reutilizable: [src/lib/components/ThemeToggle.svelte](src/lib/components/ThemeToggle.svelte) (topbar público + sidebar admin).

## PDF del CV
- Ruta dedicada **[/cv](src/routes/cv/+page.svelte)**: documento A4 imprimible (sin topbar/tema), lee de la DB. Al entrar dispara `window.print()` tras `document.fonts.ready`. El botón "Descargar PDF" del footer público linkea `/cv?mode={mode}`.
- **`mode=dev|completo`** server-side: filtra y ordena las secciones según `sections` config. La numeración 01–N se recalcula. `Languages` se renderiza siempre al final si hay datos (no entra al config).
- Sección por sección con `{#snippet secX(num)}` y un if-chain dentro del `{#each visible}` — markup bespoke (timeline/proj-grid/chips) mantenido.
- Print-tuned: `@page A4`, `.timeline > li` y `.proj` con `break-inside:avoid` (los **ítems no se parten** entre páginas), pero `.block` SÍ puede continuar (evita huecos en blanco al pie). `print-color-adjust:exact`, grid con `minmax(0,1fr)` para no desbordar.
- Foto del CV: caja portrait (3/4) con `object-position: top` (mismo problema de recorte que el hero, ya resuelto).

## Branding
- Sistema de diseño en **[MARCA.md](MARCA.md)** (es el manual real del proyecto, NO lo reescribas con otro formato).
- Primary ámbar `#F5B544`, accent cyan `#4DD4E0`. Fuentes: Space Grotesk (display), Inter (body), JetBrains Mono (code/tech/fechas).
- **NO uses naranja `#EA580C`** — eso es hab-app, otro proyecto. Assets de marca en `static/` (copiados de `marca/manual_charlsdev/`).
- **Foto del perfil**: usa **`mask-image: linear-gradient(black 78%, transparent)`** + `-webkit-mask-image` para fundir el borde inferior con el fondo del hero (`.hero-photo` en [Profile.svelte](src/lib/components/Profile.svelte)). Caja portrait (`aspect-[3/4]`), sin ring, glow ámbar detrás.

## Estructura
- `src/routes/+page.svelte` · `+page.server.ts` — sitio público. Topbar con toggle Dev/Completo y ThemeToggle. Render dinámico de secciones por orden+modo.
- `src/routes/cv/` — documento PDF imprimible (lee `?mode=`).
- `src/routes/admin/` — login, dashboard, CRUD por sección, `/admin/users`, `/admin/sections`.
- `src/lib/components` — secciones del CV + `EntityManager`, `Drawer`, `SortableList`, `ThemeToggle`.
- `src/lib/layout` — `Section.svelte` (wrapper con `title + index`), `Footer.svelte`.
- `src/lib/server/` — `db/` (schema + cliente), `cv-source.ts`, `cv-repo.ts`, `users-repo.ts`, `sections-repo.ts`, `auth.ts`.
- `src/lib/sections.ts` — registro canónico `SECTION_DEFS` (keys, labels, defaults inDev).
- `src/lib/forms.ts` — `enhanceKeep`.
- `scripts/` — `db-create`, `seed`, `seed-sections`, `user-create`, `user-passwd` (corren con tsx, fuera de SvelteKit; cubiertos por `tsconfig.node.json`).

## Antes de cambiar algo no trivial
1. `README.md` tiene el mapa del proyecto.
2. Si tocás auth/DB/sesión: leé [AUTH.md](AUTH.md) y probá login + un CRUD + revocar usuario.
3. Mantené `pnpm check` en **0/0** antes de dar algo por hecho.
4. **NUNCA crees ramas** (regla estricta del owner) — trabajá sobre `master`. **NO commitees** salvo que el owner lo pida explícitamente.
5. Cambios de schema → editá `schema.ts` y corré `pnpm db:push` (no hay migraciones).
6. Si agregás una sección nueva al CV: tabla en schema + entry en `SECTION_DEFS` + componente con prop `index` + entry en el registry `REG` de `+page.svelte` + snippet `secX` en `/cv` + caso en `hasData`.

## Despliegue
- Producción: **Dokploy con Dockerfile** (multi-stage, `pnpm prune --prod`, `node build`). NO Nixpacks (rompe adapter-node/SSR).
- Env solo en runtime. `HEALTHCHECK` pega a `/`. Detalle y tabla de env vars en [DEPLOY.md](DEPLOY.md).
- Tras el primer deploy: `pnpm db:push` + `pnpm exec tsx scripts/seed-sections.ts` + `pnpm user:create` para el primer usuario.
