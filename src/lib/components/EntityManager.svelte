<script lang="ts" generics="T extends { id: number }">
   import { applyAction, enhance } from '$app/forms'
   import { invalidateAll } from '$app/navigation'
   import type { SubmitFunction } from '@sveltejs/kit'
   import type { Snippet } from 'svelte'
   import Drawer from './Drawer.svelte'
   import SortableList from './SortableList.svelte'

   let {
      items,
      entityLabel,
      row,
      fields,
      createAction = '?/create',
      updateAction = '?/update',
      deleteAction = '?/delete',
      reorderAction = '?/reorder',
   }: {
      items: T[]
      entityLabel: string
      row: Snippet<[T]>
      fields: Snippet<[T | undefined]>
      createAction?: string
      updateAction?: string
      deleteAction?: string
      reorderAction?: string
   } = $props()

   let mode = $state<'idle' | 'create' | 'edit'>('idle')
   let editing = $state<T | undefined>(undefined)
   let error = $state<string | null>(null)
   let confirmingDelete = $state(false)
   let busy = $state(false)
   let flash = $state('')

   const open = $derived(mode !== 'idle')
   const isEdit = $derived(mode === 'edit')

   function openCreate() {
      editing = undefined
      error = null
      confirmingDelete = false
      mode = 'create'
   }
   function openEdit(it: T) {
      editing = it
      error = null
      confirmingDelete = false
      mode = 'edit'
   }
   function closeDrawer() {
      mode = 'idle'
   }
   function showFlash(msg: string) {
      flash = msg
      setTimeout(() => (flash = ''), 2200)
   }

   // Una sola enhance en el form: el botón Eliminar usa formaction={deleteAction},
   // así que detectamos la operación por la URL de submit.
   const submit: SubmitFunction = ({ action }) => {
      busy = true
      const isDelete = action.search.includes('delete')
      const wasCreate = mode === 'create'
      return async ({ result }) => {
         busy = false
         if (result.type === 'success') {
            await invalidateAll()
            closeDrawer()
            showFlash(isDelete ? 'Eliminado ✓' : wasCreate ? 'Creado ✓' : 'Guardado ✓')
         } else if (result.type === 'failure') {
            error =
               ((result.data as { error?: string } | undefined)?.error) ??
               'No se pudo completar la acción'
            confirmingDelete = false
         } else {
            await applyAction(result)
         }
      }
   }
</script>

<div class="mb-5 flex items-center justify-between gap-3">
   <div class="h-5 text-xs">
      {#if flash}<span class="text-success">{flash}</span>{/if}
   </div>
   <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2
             text-sm font-semibold text-ink transition hover:brightness-95
             active:translate-y-px"
      onclick={openCreate}
   >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
      Añadir {entityLabel}
   </button>
</div>

{#if items.length}
   <SortableList {items} action={reorderAction}>
      {#snippet children(it)}
         <button
            type="button"
            onclick={() => openEdit(it)}
            class="entity flex w-full items-center gap-3 text-left
                   transition-colors hover:border-primary"
         >
            <span class="min-w-0 flex-1">{@render row(it)}</span>
            <svg class="shrink-0 text-fg-tertiary" width="16" height="16"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round"><path d="M9 6l6 6-6 6" /></svg>
         </button>
      {/snippet}
   </SortableList>
{:else}
   <p class="muted">Todavía no hay nada cargado. Usá “Añadir {entityLabel}”.</p>
{/if}

<Drawer
   {open}
   title={isEdit ? `Editar ${entityLabel}` : `Nuevo ${entityLabel}`}
   onclose={closeDrawer}
>
   <form
      method="POST"
      action={isEdit ? updateAction : createAction}
      use:enhance={submit}
      class="flex flex-col gap-4"
   >
      {#if isEdit && editing}
         <input type="hidden" name="id" value={editing.id} />
      {/if}

      {@render fields(editing)}

      {#if error}<p class="flash flash-error">{error}</p>{/if}

      <div class="sticky bottom-0 -mx-5 -mb-5 mt-2 flex items-center gap-2
                  border-t border-line bg-surface px-5 py-3">
         <button class="btn" type="submit" disabled={busy}>
            {isEdit ? 'Guardar' : 'Crear'}
         </button>

         {#if isEdit}
            <div class="ml-auto">
               {#if confirmingDelete}
                  <span class="mr-2 text-xs text-fg-secondary">¿Eliminar?</span>
                  <button
                     class="btn-danger"
                     type="submit"
                     formaction={deleteAction}
                     formnovalidate
                     disabled={busy}
                  >
                     Sí, eliminar
                  </button>
                  <button
                     type="button"
                     class="btn-secondary"
                     onclick={() => (confirmingDelete = false)}
                  >
                     Cancelar
                  </button>
               {:else}
                  <button
                     type="button"
                     class="btn-danger"
                     onclick={() => (confirmingDelete = true)}
                  >
                     Eliminar
                  </button>
               {/if}
            </div>
         {/if}
      </div>
   </form>
</Drawer>
