<script lang="ts">
   import { enhance } from '$app/forms'
   import { enhanceKeep } from '@/forms'
   import type { ActionData, PageData } from './$types'

   let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<svelte:head><title>Admin · Redes</title></svelte:head>

<h1 class="admin-h1">Redes / perfiles</h1>
<p class="admin-lead">Enlaces sociales (LinkedIn, GitHub, X…). El nombre de la red debe coincidir con un icono soportado: GitHub, LinkedIn, X.</p>

{#if form?.saved}<p class="flash">Guardado ✓</p>{/if}
{#if form?.error}<p class="flash flash-error">{form.error}</p>{/if}

{#each data.items as p (p.id)}
   <form method="POST" action="?/update" use:enhanceKeep class="entity">
      <input type="hidden" name="id" value={p.id} />
      <div class="grid-2">
         <div class="field">
            <label for="net-{p.id}">Red</label>
            <input id="net-{p.id}" name="network" value={p.network} />
         </div>
         <div class="field">
            <label for="usr-{p.id}">Usuario</label>
            <input id="usr-{p.id}" name="username" value={p.username} />
         </div>
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="url-{p.id}">URL</label>
            <input id="url-{p.id}" name="url" value={p.url} />
         </div>
         <div class="field">
            <label for="ord-{p.id}">Orden</label>
            <input id="ord-{p.id}" name="sortOrder" type="number" value={p.sortOrder} />
         </div>
      </div>
      <div class="actions">
         <button class="btn" type="submit">Guardar</button>
         <button class="btn-danger" type="submit" formaction="?/delete">Eliminar</button>
      </div>
   </form>
{:else}
   <p class="muted">Sin redes todavía.</p>
{/each}

<form method="POST" action="?/create" use:enhance class="entity new">
   <h3>+ Nueva red</h3>
   <div class="grid-2">
      <div class="field">
         <label for="n-net">Red</label>
         <input id="n-net" name="network" placeholder="GitHub" />
      </div>
      <div class="field">
         <label for="n-usr">Usuario</label>
         <input id="n-usr" name="username" placeholder="charlsdev" />
      </div>
   </div>
   <div class="field">
      <label for="n-url">URL</label>
      <input id="n-url" name="url" placeholder="https://github.com/charlsdev" />
   </div>
   <div class="actions">
      <button class="btn btn-secondary" type="submit">Agregar</button>
   </div>
</form>
