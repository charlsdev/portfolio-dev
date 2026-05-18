<script lang="ts">
   import EntityManager from '@/components/EntityManager.svelte'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>Admin · Idiomas</title></svelte:head>

<h1 class="admin-h1">Idiomas</h1>
<p class="admin-lead">Idioma y nivel de fluidez.</p>

<EntityManager items={data.items} entityLabel="idioma">
   {#snippet row(l)}
      <span class="font-medium text-fg">{l.language}</span>
      <span class="ml-2 text-sm text-fg-secondary">{l.fluency}</span>
   {/snippet}

   {#snippet fields(l)}
      <div class="grid-2">
         <div class="field">
            <label for="lg">Idioma</label>
            <input id="lg" name="language" value={l?.language ?? ''} placeholder="Español" />
         </div>
         <div class="field">
            <label for="fl">Fluidez</label>
            <input id="fl" name="fluency" value={l?.fluency ?? ''} placeholder="Nativo" />
         </div>
      </div>
   {/snippet}
</EntityManager>
