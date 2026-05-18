<script lang="ts">
   import { enhance } from '$app/forms'
   import { enhanceKeep } from '@/forms'
   import type { ActionData, PageData } from './$types'

   let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<svelte:head><title>Admin · Experiencia</title></svelte:head>

<h1 class="admin-h1">Experiencia laboral</h1>
<p class="admin-lead">
   Dejá la fecha de fin vacía para "Actual". Los <em>highlights</em> son un ítem por línea
   (tags que aparecen bajo el resumen).
</p>

{#if form?.saved}<p class="flash">Guardado ✓</p>{/if}
{#if form?.error}<p class="flash flash-error">{form.error}</p>{/if}

{#each data.items as w (w.id)}
   <form method="POST" action="?/update" use:enhanceKeep class="entity">
      <input type="hidden" name="id" value={w.id} />
      <div class="grid-2">
         <div class="field">
            <label for="wn-{w.id}">Empresa</label>
            <input id="wn-{w.id}" name="name" value={w.name} />
         </div>
         <div class="field">
            <label for="wp-{w.id}">Posición</label>
            <input id="wp-{w.id}" name="position" value={w.position} />
         </div>
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="ws-{w.id}">Inicio</label>
            <input id="ws-{w.id}" name="startDate" type="date" value={w.startDate ?? ''} />
         </div>
         <div class="field">
            <label for="we-{w.id}">Fin</label>
            <input id="we-{w.id}" name="endDate" type="date" value={w.endDate ?? ''} />
         </div>
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="wu-{w.id}">URL (opcional)</label>
            <input id="wu-{w.id}" name="url" value={w.url ?? ''} />
         </div>
         <div class="field">
            <label for="wo-{w.id}">Orden</label>
            <input id="wo-{w.id}" name="sortOrder" type="number" value={w.sortOrder} />
         </div>
      </div>
      <div class="field">
         <label for="wsm-{w.id}">Resumen</label>
         <textarea id="wsm-{w.id}" name="summary" rows="3">{w.summary}</textarea>
      </div>
      <div class="field">
         <label for="wh-{w.id}">Highlights (uno por línea)</label>
         <textarea id="wh-{w.id}" name="highlights" rows="3">{w.highlights.join('\n')}</textarea>
      </div>
      <div class="actions">
         <button class="btn" type="submit">Guardar</button>
         <button class="btn-danger" type="submit" formaction="?/delete">Eliminar</button>
      </div>
   </form>
{:else}
   <p class="muted">Sin experiencia todavía.</p>
{/each}

<form method="POST" action="?/create" use:enhance class="entity new">
   <h3>+ Nueva experiencia</h3>
   <div class="grid-2">
      <div class="field">
         <label for="n-wn">Empresa</label>
         <input id="n-wn" name="name" />
      </div>
      <div class="field">
         <label for="n-wp">Posición</label>
         <input id="n-wp" name="position" />
      </div>
   </div>
   <div class="grid-2">
      <div class="field">
         <label for="n-ws">Inicio</label>
         <input id="n-ws" name="startDate" type="date" />
      </div>
      <div class="field">
         <label for="n-we">Fin</label>
         <input id="n-we" name="endDate" type="date" />
      </div>
   </div>
   <div class="field">
      <label for="n-wsm">Resumen</label>
      <textarea id="n-wsm" name="summary" rows="3"></textarea>
   </div>
   <div class="field">
      <label for="n-wh">Highlights (uno por línea)</label>
      <textarea id="n-wh" name="highlights" rows="3"></textarea>
   </div>
   <div class="actions">
      <button class="btn btn-secondary" type="submit">Agregar</button>
   </div>
</form>
