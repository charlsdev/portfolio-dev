@AGENTS.md

# Portfolio (charlsdev) — Notas para agentes

Portfolio personal con SSR + panel admin. El CV vive en **PostgreSQL** y se
edita desde `/admin`. Stack: **SvelteKit 2 + Svelte 5 + Tailwind v4 + Drizzle**.

## Idioma y tono
- Texto user-facing (UI, errores, copy, badges): **español neutro**.
- Variables, comentarios técnicos, commits, PRs: **inglés** (salvo comentarios de lógica de negocio que valen más en español).
- Comentarios escuetos: solo el WHY no obvio. NO documentes lo que el nombre del símbolo ya dice.

## Stack que NO es lo común
- **SvelteKit 2 + Svelte 5 (runes)** con `@sveltejs/adapter-node` (SSR, NO sitio estático, NO custom server). Dev en puerto **4000**.
- **Tailwind v4** CSS-first: tokens en `@theme` dentro de [src/app.css](src/app.css), plugin `@tailwindcss/vite` en [vite.config.ts](vite.config.ts). NO existe `tailwind.config.js`.
- **pnpm** + Node por **fnm** (en shells no-interactivos `node`/`pnpm` no están en PATH; prependé el dir de la versión activa de fnm).
- **Drizzle + postgres.js**. NO Prisma. Cliente lazy en [src/lib/server/db/index.ts](src/lib/server/db/index.ts).
- **Alias `@` → `src/lib`** (definido en [svelte.config.js](svelte.config.js)). Ej: `@/components/...`, `@/server/...`. `$lib` también funciona.
- **argon2id vía `@node-rs/argon2`** (binarios precompilados napi-rs, sin toolchain de compilación; trae el binario musl para el Alpine del Docker). NO uses el paquete `argon2` (node-gyp).

## Build de producción — gotchas (no romper)
- `src/lib/server/db/index.ts` exporta `db` como **Proxy lazy**. NO lo hagas eager: el build de SvelteKit importa módulos de servidor sin env vars y reventaría al conectar.
- [vite.config.ts](vite.config.ts) hace `Object.assign(process.env, loadEnv(mode, cwd, ''))`. Es a propósito: en dev SvelteKit expone `.env` solo vía `$env`, pero `db/index.ts` y los scripts leen `process.env` (mismo código en dev, en prod con `node --env-file` y en Dokploy). NO lo borres.
- `package.json` arranca prod con `node --env-file-if-exists=.env build` (carga `.env` en local; en Dokploy las vars las inyecta la plataforma).
- **`ORIGIN` es OBLIGATORIO en prod**: adapter-node valida CSRF de los POST de formularios contra el origin público. Sin `ORIGIN=https://dominio` exacto, **todo POST del admin da 403** (el sitio público sí carga). Ver [DEPLOY.md](DEPLOY.md).
- Páginas con datos del `load` que se referencian en `<script>` → usar `$derived` (Svelte avisa `state_referenced_locally`). El estándar del repo es `check` con **0 errores / 0 warnings**.

## Forms del admin — gotcha de `use:enhance`
- El `use:enhance` por defecto, en éxito, hace `form.reset()`. Los forms de **edición** vienen pre-cargados con `value={...}` (propiedad, no atributo) → `reset()` los deja en blanco y, como el valor real no cambió, Svelte no los re-escribe → "se borra hasta refrescar".
- Solución: los forms pre-cargados (todas las secciones de edición + `basics` + filas de `users`) usan **`use:enhanceKeep`** ([src/lib/forms.ts](src/lib/forms.ts) → `update({ reset: false })`). Los forms de **"+ Nuevo …"** usan `use:enhance` normal (ahí sí querés que se limpien).

## Auth — contra la tabla `users`
> Guía completa en [AUTH.md](AUTH.md). Léela antes de tocar login/sesión.
- Login por **cédula + contraseña** contra `users` (argon2id). **No hay credenciales en env** (solo `SESSION_SECRET`, que es clave de firma, no un usuario).
- Sesión = cookie firmada HMAC con el `userId`. [src/hooks.server.ts](src/hooks.server.ts) valida firma + que el usuario **exista y esté activo** (revocar = `is_active=false` corta el acceso al instante).
- Todos los usuarios activos = admin total (sin RBAC). Guard: no podés desactivar/eliminar tu propia cuenta.
- Gestión desde `/admin/users`. Bootstrap del primer usuario: `pnpm user:create <cedula> "<nombres>" <pass>` imprime el `INSERT` (con hash) para correr a mano. Cambio de clave: `pnpm user:passwd`.

## Base de datos
- Servidor Postgres **compartido con rim-pub** (mismas credenciales) pero base **dedicada `portfolio`** — NUNCA la base `rim`.
- Tablas vía **`pnpm db:push`** (drizzle-kit). NO hay migraciones generadas: el schema TS en [src/lib/server/db/schema.ts](src/lib/server/db/schema.ts) es la fuente de verdad. `drizzle.config.ts` tiene `strict:false` para que `push` no pida TTY.
- Columnas de tiempo (`created_at`, `updated_at`): `timestamptz`. Las fechas de CV (work/education) son **fechas de calendario → tipo `date`**, no timestamptz.
- Relaciones con `ON DELETE CASCADE` (highlights de work/projects).

## Modelo del CV
- Único punto de lectura: [src/lib/server/cv-source.ts](src/lib/server/cv-source.ts) (`loadCv()` arma el objeto `Root` JSON Resume desde la DB). Los componentes lo consumen vía contexto: `setCv()` en `+page.svelte`, `getCv()` en cada sección ([src/lib/cv-context.ts](src/lib/cv-context.ts)). Cambiar la fuente de datos = tocar **un** módulo.
- Modelo relacional por sección + `sort_order` editable. `highlights` de work/projects se editan como textarea (1 por línea), no CRUD anidado.
- Seed: `pnpm db:seed` vacía y recarga. Fuente: `src/cv.json` (real, gitignored) si existe; si no `src/cv.example.json` (template del repo).
- Skills/redes mapean iconos por `name`/`network`; sin icono se muestra solo el texto (fallback, no rompe).

## Tema light/dark
- Atributo `data-theme` en `<html>`. Script anti-FOUC inline en [src/app.html](src/app.html) lo fija antes del primer paint (localStorage o `prefers-color-scheme`).
- Tokens semánticos (`--bg`, `--surface`, `--fg`, `--line`…) conmutan por `[data-theme="dark"]`; expuestos como utilidades Tailwind vía `@theme inline` (`bg-bg`, `text-fg`, `border-line`). Los tokens de marca son constantes (`bg-primary`, `text-accent`).
- Toggle reutilizable: [src/lib/components/ThemeToggle.svelte](src/lib/components/ThemeToggle.svelte) (topbar público + sidebar admin).

## PDF del CV
- Ruta dedicada **[/cv](src/routes/cv/+page.svelte)**: documento A4 imprimible (sin topbar/tema), lee de la DB. Al entrar dispara `window.print()` tras `document.fonts.ready`. El botón "Descargar PDF" del footer público linkea ahí. Print-tuned: `@page A4`, `break-inside:avoid`, `print-color-adjust:exact`, grid con `minmax(0,1fr)` para no desbordar.

## Branding
- Sistema de diseño en **[MARCA.md](MARCA.md)** (es el manual real del proyecto, NO lo reescribas con otro formato).
- Primary ámbar `#F5B544`, accent cyan `#4DD4E0`. Fuentes: Space Grotesk (display), Inter (body), JetBrains Mono (code/tech/fechas).
- **NO uses naranja `#EA580C`** — eso es hab-app, otro proyecto. Assets de marca en `static/` (copiados de `marca/`).

## Estructura
- `src/routes/+page.svelte` · `+page.server.ts` — sitio público (load arma el CV desde la DB).
- `src/routes/cv/` — documento PDF imprimible.
- `src/routes/admin/` — panel: login, dashboard, CRUD por sección, `/admin/users`.
- `src/lib/components` · `icons` · `layout` — UI del portfolio.
- `src/lib/server/` — `db/` (schema + cliente), `cv-source.ts`, `cv-repo.ts`, `users-repo.ts`, `auth.ts`.
- `scripts/` — `db-create`, `seed`, `user-create`, `user-passwd` (corren con tsx, fuera de SvelteKit; cubiertos por `tsconfig.node.json`).

## Antes de cambiar algo no trivial
1. `README.md` tiene el mapa completo del proyecto.
2. Si tocás auth/DB/sesión: leé [AUTH.md](AUTH.md) y probá login + un CRUD + revocar usuario.
3. Mantené `pnpm check` en **0/0** antes de dar algo por hecho.
4. Para deploys: NUNCA `git push --force` a `master` sin pedir confirmación. Confirmá que `ORIGIN` quede seteado al dominio real.
5. Cambios de schema → editá `schema.ts` y corré `pnpm db:push` (no hay migraciones).

## Despliegue
- Producción: **Dokploy con Dockerfile** (multi-stage, `pnpm prune --prod`, `node build`). NO Nixpacks (rompe adapter-node/SSR).
- Env solo en runtime. `HEALTHCHECK` pega a `/`. Detalle y tabla de env vars en [DEPLOY.md](DEPLOY.md).
