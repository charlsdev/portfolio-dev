# This is NOT the SvelteKit/Tailwind you know

- **SvelteKit 2 + Svelte 5 (runes)**. Componentes legacy de Svelte 4 conviven, pero el código nuevo usa `$props/$state/$derived` y `{@render}`. No asumas Svelte 4.
- **Tailwind v4** (CSS-first, `@theme` en `src/app.css`, plugin `@tailwindcss/vite`). NO hay `tailwind.config.js`. El config v3 que aparece en `MARCA.md` es solo referencia de tokens.
- Lee la guía relevante en `node_modules/@sveltejs/kit/**` o `node_modules/svelte/**` antes de tocar APIs que no recuerdes con certeza. Honra los deprecation notices (ej. `<svelte:component>`).
