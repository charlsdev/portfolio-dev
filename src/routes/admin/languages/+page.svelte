<script lang="ts">
   import { enhance } from '$app/forms'
   import { enhanceKeep } from '@/forms'
   import type { ActionData, PageData } from './$types'

   let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<svelte:head><title>Admin · Idiomas</title></svelte:head>

<h1 class="admin-h1">Idiomas</h1>
<p class="admin-lead">Idioma y nivel de fluidez.</p>

{#if form?.saved}<p class="flash">Guardado ✓</p>{/if}
{#if form?.error}<p class="flash flash-error">{form.error}</p>{/if}

{#each data.items as l (l.id)}
   <form method="POST" action="?/update" use:enhanceKeep class="entity">
      <input type="hidden" name="id" value={l.id} />
      <div class="grid-2">
         <div class="field">
            <label for="lg-{l.id}">Idioma</label>
            <input id="lg-{l.id}" name="language" value={l.language} />
         </div>
         <div class="field">
            <label for="fl-{l.id}">Fluidez</label>
            <input id="fl-{l.id}" name="fluency" value={l.fluency} />
         </div>
      </div>
      <div class="field" style="max-width:140px">
         <label for="lo-{l.id}">Orden</label>
         <input id="lo-{l.id}" name="sortOrder" type="number" value={l.sortOrder} />
      </div>
      <div class="actions">
         <button class="btn" type="submit">Guardar</button>
         <button class="btn-danger" type="submit" formaction="?/delete">Eliminar</button>
      </div>
   </form>
{:else}
   <p class="muted">Sin idiomas todavía.</p>
{/each}

<form method="POST" action="?/create" use:enhance class="entity new">
   <h3>+ Nuevo idioma</h3>
   <div class="grid-2">
      <div class="field">
         <label for="n-lg">Idioma</label>
         <input id="n-lg" name="language" placeholder="Español" />
      </div>
      <div class="field">
         <label for="n-fl">Fluidez</label>
         <input id="n-fl" name="fluency" placeholder="Nativo" />
      </div>
   </div>
   <div class="actions">
      <button class="btn btn-secondary" type="submit">Agregar</button>
   </div>
</form>
