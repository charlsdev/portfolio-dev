<script lang="ts">
   import EntityManager from '@/components/EntityManager.svelte'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>Admin · Cursos</title></svelte:head>

<h1 class="admin-h1">Cursos y capacitaciones</h1>
<p class="admin-lead">Título, institución, horas, lugar y fechas.</p>

<EntityManager items={data.items} entityLabel="curso">
   {#snippet row(c)}
      <span class="font-medium text-fg">{c.title}</span>
      <span class="ml-2 text-sm text-fg-secondary">{c.institution}</span>
      {#if c.hours}<span class="ml-2 font-mono text-xs text-fg-tertiary">{c.hours}</span>{/if}
   {/snippet}

   {#snippet fields(c)}
      <div class="field">
         <label for="title">Título</label>
         <input id="title" name="title" value={c?.title ?? ''} />
      </div>
      <div class="field">
         <label for="inst">Institución</label>
         <input id="inst" name="institution" value={c?.institution ?? ''} />
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="hours">Cantidad de horas</label>
            <input id="hours" name="hours" value={c?.hours ?? ''} placeholder="40 horas" />
         </div>
         <div class="field">
            <label for="loc">Lugar</label>
            <input id="loc" name="location" value={c?.location ?? ''} placeholder="Ecuador – Quito" />
         </div>
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="sd">Fecha inicio</label>
            <input id="sd" name="startDate" type="date" value={c?.startDate ?? ''} />
         </div>
         <div class="field">
            <label for="ed">Fecha fin</label>
            <input id="ed" name="endDate" type="date" value={c?.endDate ?? ''} />
         </div>
      </div>
   {/snippet}
</EntityManager>
