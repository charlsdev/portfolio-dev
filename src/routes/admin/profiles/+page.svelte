<script lang="ts">
   import EntityManager from '@/components/EntityManager.svelte'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>Admin · Redes</title></svelte:head>

<h1 class="admin-h1">Redes / perfiles</h1>
<p class="admin-lead">
   Enlaces sociales. El nombre de la red debe coincidir con un icono soportado:
   GitHub, LinkedIn, X.
</p>

<EntityManager items={data.items} entityLabel="red">
   {#snippet row(p)}
      <span class="font-medium text-fg">{p.network}</span>
      <span class="ml-2 text-sm text-fg-secondary">{p.username}</span>
      <span class="ml-2 font-mono text-xs text-fg-tertiary">
         {p.url?.replace(/^https?:\/\//, '')}
      </span>
   {/snippet}

   {#snippet fields(p)}
      <div class="grid-2">
         <div class="field">
            <label for="net">Red</label>
            <input id="net" name="network" value={p?.network ?? ''} placeholder="GitHub" />
         </div>
         <div class="field">
            <label for="usr">Usuario</label>
            <input id="usr" name="username" value={p?.username ?? ''} placeholder="charlsdev" />
         </div>
      </div>
      <div class="field">
         <label for="url">URL</label>
         <input
            id="url"
            name="url"
            value={p?.url ?? ''}
            placeholder="https://github.com/charlsdev"
         />
      </div>
   {/snippet}
</EntityManager>
