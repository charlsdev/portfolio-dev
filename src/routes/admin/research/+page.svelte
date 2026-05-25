<script lang="ts">
   import EntityManager from '@/components/EntityManager.svelte'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>Admin · Investigaciones</title></svelte:head>

<h1 class="admin-h1">Investigaciones</h1>
<p class="admin-lead">
   Título, institución, autores (si no hay, el investigador principal) y años.
</p>

<EntityManager items={data.items} entityLabel="investigación">
   {#snippet row(r)}
      <span class="font-medium text-fg">{r.title}</span>
      <span class="ml-2 text-sm text-fg-secondary">{r.institution}</span>
      {#if r.startYear}
         <span class="ml-2 font-mono text-xs text-fg-tertiary">
            {r.startYear}{r.endYear ? `–${r.endYear}` : ''}
         </span>
      {/if}
   {/snippet}

   {#snippet fields(r)}
      <div class="field">
         <label for="title">Título</label>
         <input id="title" name="title" value={r?.title ?? ''} />
      </div>
      <div class="field">
         <label for="inst">Institución</label>
         <input id="inst" name="institution" value={r?.institution ?? ''} />
      </div>
      <div class="field">
         <label for="au">Autores</label>
         <input
            id="au"
            name="authors"
            value={r?.authors ?? ''}
            placeholder="Si no hay, el investigador principal"
         />
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="sy">Año inicio</label>
            <input id="sy" name="startYear" type="number" inputmode="numeric" value={r?.startYear ?? ''} />
         </div>
         <div class="field">
            <label for="ey">Año fin</label>
            <input id="ey" name="endYear" type="number" inputmode="numeric" value={r?.endYear ?? ''} />
         </div>
      </div>
   {/snippet}
</EntityManager>
