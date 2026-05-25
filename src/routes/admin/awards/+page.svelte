<script lang="ts">
   import EntityManager from '@/components/EntityManager.svelte'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>Admin · Méritos</title></svelte:head>

<h1 class="admin-h1">Méritos y distinciones</h1>
<p class="admin-lead">Título, institución y años (el año fin puede quedar vacío).</p>

<EntityManager items={data.items} entityLabel="mérito">
   {#snippet row(a)}
      <span class="font-medium text-fg">{a.title}</span>
      <span class="ml-2 text-sm text-fg-secondary">{a.institution}</span>
      {#if a.startYear}
         <span class="ml-2 font-mono text-xs text-fg-tertiary">
            {a.startYear}{a.endYear ? `–${a.endYear}` : ''}
         </span>
      {/if}
   {/snippet}

   {#snippet fields(a)}
      <div class="field">
         <label for="title">Título</label>
         <input id="title" name="title" value={a?.title ?? ''} />
      </div>
      <div class="field">
         <label for="inst">Institución</label>
         <input id="inst" name="institution" value={a?.institution ?? ''} />
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="sy">Año inicio</label>
            <input id="sy" name="startYear" type="number" inputmode="numeric" value={a?.startYear ?? ''} />
         </div>
         <div class="field">
            <label for="ey">Año fin (opcional)</label>
            <input id="ey" name="endYear" type="number" inputmode="numeric" value={a?.endYear ?? ''} />
         </div>
      </div>
   {/snippet}
</EntityManager>
