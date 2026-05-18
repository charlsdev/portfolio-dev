<script lang="ts">
   import EntityManager from '@/components/EntityManager.svelte'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>Admin · Proyectos</title></svelte:head>

<h1 class="admin-h1">Proyectos</h1>
<p class="admin-lead">
   "Activo" muestra el punto verde en el sitio. Los <em>highlights</em> van uno por
   línea (tecnologías).
</p>

<EntityManager items={data.items} entityLabel="proyecto">
   {#snippet row(p)}
      {#if p.isActive}
         <span
            class="mr-2 inline-block size-2 shrink-0 rounded-full bg-success
                   align-middle"
            title="Activo"
         ></span>
      {/if}
      <span class="font-medium text-fg">{p.name}</span>
      <span class="ml-2 text-sm text-fg-secondary">{p.description}</span>
   {/snippet}

   {#snippet fields(p)}
      <div class="field">
         <label for="pn">Nombre</label>
         <input id="pn" name="name" value={p?.name ?? ''} />
      </div>
      <div class="field">
         <label for="pd">Descripción</label>
         <textarea id="pd" name="description" rows="3">{p?.description ?? ''}</textarea>
      </div>
      <div class="grid-2">
         <div class="field">
            <label for="pu">URL</label>
            <input id="pu" name="url" value={p?.url ?? ''} />
         </div>
         <div class="field">
            <label for="pg">GitHub (opcional)</label>
            <input id="pg" name="github" value={p?.github ?? ''} />
         </div>
      </div>
      <div class="field">
         <label for="ph">Highlights (uno por línea)</label>
         <textarea id="ph" name="highlights" rows="4">{(p?.highlights ?? []).join('\n')}</textarea>
      </div>
      <div class="field checkbox">
         <input id="pa" name="isActive" type="checkbox" checked={p?.isActive ?? false} />
         <label for="pa">Activo</label>
      </div>
   {/snippet}
</EntityManager>
