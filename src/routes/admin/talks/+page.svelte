<script lang="ts">
   import EntityManager from '@/components/EntityManager.svelte'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>Admin · Ponencias</title></svelte:head>

<h1 class="admin-h1">Ponencias</h1>
<p class="admin-lead">Título, institución, congreso, lugar y fechas (texto libre).</p>

<EntityManager items={data.items} entityLabel="ponencia">
   {#snippet row(t)}
      <span class="font-medium text-fg">{t.title}</span>
      <span class="ml-2 text-sm text-fg-secondary">{t.congress || t.institution}</span>
      {#if t.dates}<span class="ml-2 font-mono text-xs text-fg-tertiary">{t.dates}</span>{/if}
   {/snippet}

   {#snippet fields(t)}
      <div class="field">
         <label for="title">Título</label>
         <input id="title" name="title" value={t?.title ?? ''} />
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="inst">Institución</label>
            <input id="inst" name="institution" value={t?.institution ?? ''} />
         </div>
         <div class="field">
            <label for="cong">Congreso</label>
            <input id="cong" name="congress" value={t?.congress ?? ''} />
         </div>
      </div>
      <div class="field">
         <label for="loc">Lugar</label>
         <input id="loc" name="location" value={t?.location ?? ''} />
      </div>
      <div class="field">
         <label for="dates">Fechas</label>
         <input
            id="dates"
            name="dates"
            value={t?.dates ?? ''}
            placeholder="25 al 26 de abril del 2019"
         />
      </div>
   {/snippet}
</EntityManager>
