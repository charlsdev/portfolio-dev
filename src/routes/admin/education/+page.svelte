<script lang="ts">
   import { enhance } from '$app/forms'
   import { enhanceKeep } from '@/forms'
   import type { ActionData, PageData } from './$types'

   let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<svelte:head><title>Admin · Estudios</title></svelte:head>

<h1 class="admin-h1">Estudios</h1>
<p class="admin-lead">Formación académica. Dejá la fecha de fin vacía si está en curso.</p>

{#if form?.saved}<p class="flash">Guardado ✓</p>{/if}
{#if form?.error}<p class="flash flash-error">{form.error}</p>{/if}

{#each data.items as e (e.id)}
   <form method="POST" action="?/update" use:enhanceKeep class="entity">
      <input type="hidden" name="id" value={e.id} />
      <div class="field">
         <label for="ins-{e.id}">Institución</label>
         <input id="ins-{e.id}" name="institution" value={e.institution} />
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="ar-{e.id}">Área</label>
            <input id="ar-{e.id}" name="area" value={e.area} />
         </div>
         <div class="field">
            <label for="st-{e.id}">Tipo de estudio</label>
            <input id="st-{e.id}" name="studyType" value={e.studyType} />
         </div>
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="sd-{e.id}">Inicio</label>
            <input id="sd-{e.id}" name="startDate" type="date" value={e.startDate ?? ''} />
         </div>
         <div class="field">
            <label for="ed-{e.id}">Fin</label>
            <input id="ed-{e.id}" name="endDate" type="date" value={e.endDate ?? ''} />
         </div>
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="sc-{e.id}">Nota / score</label>
            <input id="sc-{e.id}" name="score" value={e.score} />
         </div>
         <div class="field">
            <label for="eo-{e.id}">Orden</label>
            <input id="eo-{e.id}" name="sortOrder" type="number" value={e.sortOrder} />
         </div>
      </div>
      <div class="field">
         <label for="eu-{e.id}">URL (opcional)</label>
         <input id="eu-{e.id}" name="url" value={e.url ?? ''} />
      </div>
      <div class="actions">
         <button class="btn" type="submit">Guardar</button>
         <button class="btn-danger" type="submit" formaction="?/delete">Eliminar</button>
      </div>
   </form>
{:else}
   <p class="muted">Sin estudios todavía.</p>
{/each}

<form method="POST" action="?/create" use:enhance class="entity new">
   <h3>+ Nuevo estudio</h3>
   <div class="field">
      <label for="n-ins">Institución</label>
      <input id="n-ins" name="institution" />
   </div>
   <div class="grid-2">
      <div class="field">
         <label for="n-ar">Área</label>
         <input id="n-ar" name="area" />
      </div>
      <div class="field">
         <label for="n-st">Tipo de estudio</label>
         <input id="n-st" name="studyType" />
      </div>
   </div>
   <div class="grid-2">
      <div class="field">
         <label for="n-sd">Inicio</label>
         <input id="n-sd" name="startDate" type="date" />
      </div>
      <div class="field">
         <label for="n-ed">Fin</label>
         <input id="n-ed" name="endDate" type="date" />
      </div>
   </div>
   <div class="actions">
      <button class="btn btn-secondary" type="submit">Agregar</button>
   </div>
</form>
