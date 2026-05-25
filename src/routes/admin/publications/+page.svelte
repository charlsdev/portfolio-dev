<script lang="ts">
   import EntityManager from '@/components/EntityManager.svelte'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>Admin · Publicaciones</title></svelte:head>

<h1 class="admin-h1">Publicaciones</h1>
<p class="admin-lead">Título, institución, coautores, revista y año.</p>

<EntityManager items={data.items} entityLabel="publicación">
   {#snippet row(p)}
      <span class="font-medium text-fg">{p.title}</span>
      {#if p.journal}<span class="ml-2 text-sm italic text-fg-secondary">{p.journal}</span>{/if}
      {#if p.year}<span class="ml-2 font-mono text-xs text-fg-tertiary">{p.year}</span>{/if}
   {/snippet}

   {#snippet fields(p)}
      <div class="field">
         <label for="title">Título</label>
         <input id="title" name="title" value={p?.title ?? ''} />
      </div>
      <div class="field">
         <label for="inst">Institución</label>
         <input id="inst" name="institution" value={p?.institution ?? ''} />
      </div>
      <div class="field">
         <label for="co">Coautores</label>
         <input id="co" name="coauthors" value={p?.coauthors ?? ''} />
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="jr">Revista</label>
            <input id="jr" name="journal" value={p?.journal ?? ''} />
         </div>
         <div class="field">
            <label for="yr">Año</label>
            <input id="yr" name="year" type="number" inputmode="numeric" value={p?.year ?? ''} />
         </div>
      </div>
   {/snippet}
</EntityManager>
