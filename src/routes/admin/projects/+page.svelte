<script lang="ts">
   import { enhance } from '$app/forms'
   import { enhanceKeep } from '@/forms'
   import type { ActionData, PageData } from './$types'

   let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<svelte:head><title>Admin · Proyectos</title></svelte:head>

<h1 class="admin-h1">Proyectos</h1>
<p class="admin-lead">
   "Activo" muestra el punto verde. Los <em>highlights</em> son un ítem por línea (tecnologías).
</p>

{#if form?.saved}<p class="flash">Guardado ✓</p>{/if}
{#if form?.error}<p class="flash flash-error">{form.error}</p>{/if}

{#each data.items as p (p.id)}
   <form method="POST" action="?/update" use:enhanceKeep class="entity">
      <input type="hidden" name="id" value={p.id} />
      <div class="field">
         <label for="pn-{p.id}">Nombre</label>
         <input id="pn-{p.id}" name="name" value={p.name} />
      </div>
      <div class="field">
         <label for="pd-{p.id}">Descripción</label>
         <textarea id="pd-{p.id}" name="description" rows="2">{p.description}</textarea>
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="pu-{p.id}">URL</label>
            <input id="pu-{p.id}" name="url" value={p.url} />
         </div>
         <div class="field">
            <label for="pg-{p.id}">GitHub (opcional)</label>
            <input id="pg-{p.id}" name="github" value={p.github ?? ''} />
         </div>
      </div>
      <div class="field">
         <label for="ph-{p.id}">Highlights (uno por línea)</label>
         <textarea id="ph-{p.id}" name="highlights" rows="3">{p.highlights.join('\n')}</textarea>
      </div>
      <div class="grid-2">
         <div class="field checkbox">
            <input id="pa-{p.id}" name="isActive" type="checkbox" checked={p.isActive} />
            <label for="pa-{p.id}">Activo</label>
         </div>
         <div class="field">
            <label for="po-{p.id}">Orden</label>
            <input id="po-{p.id}" name="sortOrder" type="number" value={p.sortOrder} />
         </div>
      </div>
      <div class="actions">
         <button class="btn" type="submit">Guardar</button>
         <button class="btn-danger" type="submit" formaction="?/delete">Eliminar</button>
      </div>
   </form>
{:else}
   <p class="muted">Sin proyectos todavía.</p>
{/each}

<form method="POST" action="?/create" use:enhance class="entity new">
   <h3>+ Nuevo proyecto</h3>
   <div class="field">
      <label for="n-pn">Nombre</label>
      <input id="n-pn" name="name" />
   </div>
   <div class="field">
      <label for="n-pd">Descripción</label>
      <textarea id="n-pd" name="description" rows="2"></textarea>
   </div>
   <div class="grid-2">
      <div class="field">
         <label for="n-pu">URL</label>
         <input id="n-pu" name="url" />
      </div>
      <div class="field">
         <label for="n-pg">GitHub (opcional)</label>
         <input id="n-pg" name="github" />
      </div>
   </div>
   <div class="field">
      <label for="n-ph">Highlights (uno por línea)</label>
      <textarea id="n-ph" name="highlights" rows="3"></textarea>
   </div>
   <div class="field checkbox">
      <input id="n-pa" name="isActive" type="checkbox" />
      <label for="n-pa">Activo</label>
   </div>
   <div class="actions">
      <button class="btn btn-secondary" type="submit">Agregar</button>
   </div>
</form>
