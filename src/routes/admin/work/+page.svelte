<script lang="ts">
   import EntityManager from '@/components/EntityManager.svelte'
   import { transformDate } from '@/utils/transformDate'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>Admin · Experiencia</title></svelte:head>

<h1 class="admin-h1">Experiencia laboral</h1>
<p class="admin-lead">
   Dejá la fecha de fin vacía para "Actual". Los <em>highlights</em> van uno por línea.
</p>

<EntityManager items={data.items} entityLabel="experiencia">
   {#snippet row(w)}
      <span class="font-medium text-fg">{w.name}</span>
      <span class="ml-2 text-sm text-fg-secondary">{w.position}</span>
      <span class="ml-2 font-mono text-xs text-fg-tertiary">
         {w.startDate ? transformDate(w.startDate) : ''}{w.startDate ? ' — ' : ''}{w.endDate
            ? transformDate(w.endDate)
            : 'Actual'}
      </span>
   {/snippet}

   {#snippet fields(w)}
      <div class="grid-2">
         <div class="field">
            <label for="wn">Empresa</label>
            <input id="wn" name="name" value={w?.name ?? ''} />
         </div>
         <div class="field">
            <label for="wp">Posición</label>
            <input id="wp" name="position" value={w?.position ?? ''} />
         </div>
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="ws">Inicio</label>
            <input id="ws" name="startDate" type="date" value={w?.startDate ?? ''} />
         </div>
         <div class="field">
            <label for="we">Fin</label>
            <input id="we" name="endDate" type="date" value={w?.endDate ?? ''} />
         </div>
      </div>
      <div class="field">
         <label for="wu">URL (opcional)</label>
         <input id="wu" name="url" value={w?.url ?? ''} />
      </div>
      <div class="field">
         <label for="wsm">Resumen</label>
         <textarea id="wsm" name="summary" rows="3">{w?.summary ?? ''}</textarea>
      </div>
      <div class="field">
         <label for="wh">Highlights (uno por línea)</label>
         <textarea id="wh" name="highlights" rows="3">{(w?.highlights ?? []).join('\n')}</textarea>
      </div>
   {/snippet}
</EntityManager>
