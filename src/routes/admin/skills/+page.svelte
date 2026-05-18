<script lang="ts">
   import EntityManager from '@/components/EntityManager.svelte'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>Admin · Habilidades</title></svelte:head>

<h1 class="admin-h1">Habilidades</h1>
<p class="admin-lead">
   El <strong>nombre</strong> determina el icono (HTML, CSS, JavaScript, TypeScript, React,
   Node, MySQL, Git, GitHub, NextJS, Tailwind, Svelte, PostgreSQL, MongoDB, Docker, Prisma,
   GraphQL, Hono, Astro, Hana, ReactQuery, Redis, PHP). Sin icono se muestra solo el texto.
</p>

<EntityManager items={data.items} entityLabel="habilidad">
   {#snippet row(s)}
      <span class="font-medium text-fg">{s.description || s.name}</span>
      <span class="ml-2 font-mono text-xs text-fg-tertiary">{s.name}</span>
   {/snippet}

   {#snippet fields(s)}
      <div class="field">
         <label for="nm">Nombre (clave de icono)</label>
         <input id="nm" name="name" value={s?.name ?? ''} placeholder="PostgreSQL" />
      </div>
      <div class="field">
         <label for="ds">Etiqueta visible</label>
         <input id="ds" name="description" value={s?.description ?? ''} placeholder="PostgreSQL" />
      </div>
   {/snippet}
</EntityManager>
