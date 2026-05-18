<script lang="ts">
   import { enhanceKeep } from '@/forms'
   import type { ActionData, PageData } from './$types'

   let { data, form }: { data: PageData; form: ActionData } = $props()
   const b = $derived(data.basics)
</script>

<svelte:head><title>Admin · Datos básicos</title></svelte:head>

<h1 class="admin-h1">Datos básicos</h1>
<p class="admin-lead">Nombre, contacto, ubicación y resumen del perfil.</p>

{#if form?.saved}<p class="flash">Guardado ✓</p>{/if}
{#if form?.error}<p class="flash flash-error">{form.error}</p>{/if}

<form method="POST" use:enhanceKeep class="entity">
   <div class="grid-2">
      <div class="field">
         <label for="name">Nombre</label>
         <input id="name" name="name" value={b?.name ?? ''} required />
      </div>
      <div class="field">
         <label for="email">Email</label>
         <input id="email" name="email" type="email" value={b?.email ?? ''} />
      </div>
   </div>

   <div class="field">
      <label for="label">Título / headline</label>
      <input id="label" name="label" value={b?.label ?? ''} />
   </div>

   <div class="grid-2">
      <div class="field">
         <label for="phone">Teléfono</label>
         <input id="phone" name="phone" value={b?.phone ?? ''} />
      </div>
      <div class="field">
         <label for="url">URL del sitio</label>
         <input id="url" name="url" value={b?.url ?? ''} />
      </div>
   </div>

   <div class="field">
      <label for="image">Imagen (ruta o URL)</label>
      <input id="image" name="image" value={b?.image ?? ''} />
      <span class="hint">Ej: /charlsdev.jpg (archivo en /static) o una URL absoluta.</span>
   </div>

   <div class="field">
      <label for="summary">Resumen (Sobre mí)</label>
      <textarea id="summary" name="summary" rows="5">{b?.summary ?? ''}</textarea>
   </div>

   <div class="grid-2">
      <div class="field">
         <label for="city">Ciudad</label>
         <input id="city" name="city" value={b?.city ?? ''} />
      </div>
      <div class="field">
         <label for="region">Región / País</label>
         <input id="region" name="region" value={b?.region ?? ''} />
      </div>
   </div>
   <div class="grid-2">
      <div class="field">
         <label for="address">Dirección</label>
         <input id="address" name="address" value={b?.address ?? ''} />
      </div>
      <div class="field">
         <label for="postalCode">Código postal</label>
         <input id="postalCode" name="postalCode" value={b?.postalCode ?? ''} />
      </div>
   </div>
   <div class="field" style="max-width:50%">
      <label for="countryCode">Código de país</label>
      <input id="countryCode" name="countryCode" value={b?.countryCode ?? ''} />
   </div>

   <div class="actions">
      <button class="btn" type="submit">Guardar</button>
   </div>
</form>
