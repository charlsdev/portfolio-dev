<script lang="ts">
   import { enhance } from '$app/forms'
   import { enhanceKeep } from '@/forms'
   import type { ActionData, PageData } from './$types'

   let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<svelte:head><title>Admin · Habilidades</title></svelte:head>

<h1 class="admin-h1">Habilidades</h1>
<p class="admin-lead">
   El <strong>nombre</strong> determina el icono (HTML, CSS, JavaScript, TypeScript, React, Node,
   MySQL, Git, GitHub, NextJS, Tailwind, Svelte, PostgreSQL, MongoDB, Docker, Prisma, GraphQL,
   Hono, Astro, Hana, ReactQuery, Redis, PHP). Sin icono se muestra solo el texto.
</p>

{#if form?.saved}<p class="flash">Guardado ✓</p>{/if}
{#if form?.error}<p class="flash flash-error">{form.error}</p>{/if}

{#each data.items as s (s.id)}
   <form method="POST" action="?/update" use:enhanceKeep class="entity">
      <input type="hidden" name="id" value={s.id} />
      <div class="grid-2">
         <div class="field">
            <label for="nm-{s.id}">Nombre (clave de icono)</label>
            <input id="nm-{s.id}" name="name" value={s.name} />
         </div>
         <div class="field">
            <label for="ds-{s.id}">Etiqueta visible</label>
            <input id="ds-{s.id}" name="description" value={s.description} />
         </div>
      </div>
      <div class="field" style="max-width:140px">
         <label for="or-{s.id}">Orden</label>
         <input id="or-{s.id}" name="sortOrder" type="number" value={s.sortOrder} />
      </div>
      <div class="actions">
         <button class="btn" type="submit">Guardar</button>
         <button class="btn-danger" type="submit" formaction="?/delete">Eliminar</button>
      </div>
   </form>
{:else}
   <p class="muted">Sin habilidades todavía.</p>
{/each}

<form method="POST" action="?/create" use:enhance class="entity new">
   <h3>+ Nueva habilidad</h3>
   <div class="grid-2">
      <div class="field">
         <label for="n-nm">Nombre (clave de icono)</label>
         <input id="n-nm" name="name" placeholder="PostgreSQL" />
      </div>
      <div class="field">
         <label for="n-ds">Etiqueta visible</label>
         <input id="n-ds" name="description" placeholder="PostgreSQL" />
      </div>
   </div>
   <div class="actions">
      <button class="btn btn-secondary" type="submit">Agregar</button>
   </div>
</form>
