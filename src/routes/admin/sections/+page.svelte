<script lang="ts">
   import SortableList from '@/components/SortableList.svelte'
   import { enhanceKeep } from '@/forms'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>Admin · Secciones</title></svelte:head>

<h1 class="admin-h1">Secciones</h1>
<p class="admin-lead">
   Arrastrá para definir el <strong>orden</strong> de las secciones en el sitio y el PDF.
   Marcá cuáles aparecen en el modo <strong>Dev</strong>; el modo <strong>Completo</strong>
   muestra todas. (Una sección solo se ve si tiene contenido cargado.)
</p>

<SortableList items={data.sections} action="?/reorder">
   {#snippet children(s)}
      <div class="entity flex items-center justify-between gap-3">
         <span class="font-medium text-fg">{s.label}</span>
         <form method="POST" action="?/toggleDev" use:enhanceKeep>
            <input type="hidden" name="id" value={s.id} />
            <input type="hidden" name="inDev" value={(!s.inDev).toString()} />
            <button
               type="submit"
               aria-pressed={s.inDev}
               class="rounded-full border px-3 py-1 text-xs font-semibold transition-colors
                      {s.inDev
                  ? 'border-primary bg-primary text-ink'
                  : 'border-line text-fg-tertiary hover:border-primary hover:text-primary'}"
            >
               {s.inDev ? 'En Dev ✓' : 'Solo Completo'}
            </button>
         </form>
      </div>
   {/snippet}
</SortableList>
