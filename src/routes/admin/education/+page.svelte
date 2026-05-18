<script lang="ts">
   import EntityManager from '@/components/EntityManager.svelte'
   import { transformDate } from '@/utils/transformDate'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>Admin · Estudios</title></svelte:head>

<h1 class="admin-h1">Estudios</h1>
<p class="admin-lead">Formación académica. Dejá la fecha de fin vacía si está en curso.</p>

<EntityManager items={data.items} entityLabel="estudio">
   {#snippet row(e)}
      <span class="font-medium text-fg">{e.area || e.institution}</span>
      <span class="ml-2 text-sm text-fg-secondary">{e.institution}</span>
      <span class="ml-2 font-mono text-xs text-fg-tertiary">
         {e.startDate ? transformDate(e.startDate) : ''}{e.startDate ? ' — ' : ''}{e.endDate
            ? transformDate(e.endDate)
            : 'Actual'}
      </span>
   {/snippet}

   {#snippet fields(e)}
      <div class="field">
         <label for="ins">Institución</label>
         <input id="ins" name="institution" value={e?.institution ?? ''} />
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="ar">Área</label>
            <input id="ar" name="area" value={e?.area ?? ''} />
         </div>
         <div class="field">
            <label for="st">Tipo de estudio</label>
            <input id="st" name="studyType" value={e?.studyType ?? ''} />
         </div>
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="sd">Inicio</label>
            <input id="sd" name="startDate" type="date" value={e?.startDate ?? ''} />
         </div>
         <div class="field">
            <label for="ed">Fin</label>
            <input id="ed" name="endDate" type="date" value={e?.endDate ?? ''} />
         </div>
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="sc">Nota / score</label>
            <input id="sc" name="score" value={e?.score ?? ''} />
         </div>
         <div class="field">
            <label for="eu">URL (opcional)</label>
            <input id="eu" name="url" value={e?.url ?? ''} />
         </div>
      </div>
   {/snippet}
</EntityManager>
