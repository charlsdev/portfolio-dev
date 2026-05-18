<script lang="ts" generics="T extends { id: number }">
   import type { Snippet } from 'svelte'
   import { dndzone, SOURCES, TRIGGERS } from 'svelte-dnd-action'

   let {
      items,
      action = '?/reorder',
      children,
   }: {
      items: T[]
      action?: string
      children: Snippet<[T]>
   } = $props()

   // Copia local mutable que la dndzone reordena. Se resincroniza cuando el
   // server invalida (crear/borrar) — el reorder es optimista y NO invalida,
   // así que no pisa ediciones sin guardar ni recarga la lista.
   // svelte-ignore state_referenced_locally
   let list = $state<T[]>(items)
   $effect(() => {
      list = items
   })

   let dragDisabled = $state(true)
   let saving = $state(false)
   let savedFlash = $state(false)
   let error = $state(false)

   const FLIP = 160

   function handleConsider(e: CustomEvent) {
      const { items: next, info } = e.detail
      list = next
      // teclado: al soltar, volver a bloquear
      if (info.source === SOURCES.KEYBOARD && info.trigger === TRIGGERS.DRAG_STOPPED) {
         dragDisabled = true
      }
   }

   async function handleFinalize(e: CustomEvent) {
      const { items: next, info } = e.detail
      list = next
      if (info.source === SOURCES.POINTER) dragDisabled = true
      await persist()
   }

   async function persist() {
      saving = true
      error = false
      try {
         const body = new URLSearchParams()
         body.set('ids', JSON.stringify(list.map((i) => i.id)))
         const res = await fetch(action, {
            method: 'POST',
            headers: { 'x-sveltekit-action': 'true' },
            body,
         })
         if (!res.ok) throw new Error(String(res.status))
         savedFlash = true
         setTimeout(() => (savedFlash = false), 1800)
      } catch {
         error = true
         list = items // revertir al orden real del server
         setTimeout(() => (error = false), 3500)
      } finally {
         saving = false
      }
   }

   // Handle: solo arrastra desde el ⠿ (los inputs siguen editables)
   function startDrag(e: Event) {
      e.preventDefault()
      dragDisabled = false
   }
   function handleKeydown(e: KeyboardEvent) {
      if ((e.key === 'Enter' || e.key === ' ') && dragDisabled) {
         e.preventDefault()
         dragDisabled = false
      }
   }
</script>

<div class="mb-2 flex h-5 items-center gap-2 text-xs">
   {#if saving}
      <span class="text-fg-tertiary">Guardando orden…</span>
   {:else if savedFlash}
      <span class="text-success">✓ Orden guardado</span>
   {:else if error}
      <span class="text-error">No se pudo guardar el orden</span>
   {/if}
</div>

<ul
   class="flex flex-col"
   use:dndzone={{ items: list, flipDurationMs: FLIP, dragDisabled, dropTargetStyle: {} }}
   onconsider={handleConsider}
   onfinalize={handleFinalize}
>
   {#each list as it (it.id)}
      <li class="flex items-start gap-2">
         <button
            type="button"
            class="mt-3 grid size-8 shrink-0 cursor-grab touch-none place-items-center
                   rounded-md border border-line text-fg-tertiary transition-colors
                   hover:border-primary hover:text-primary active:cursor-grabbing
                   aria-disabled:opacity-40"
            aria-label="Arrastrar para reordenar"
            title="Arrastrar para reordenar"
            tabindex="0"
            onmousedown={startDrag}
            ontouchstart={startDrag}
            onkeydown={handleKeydown}
         >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
               <circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" />
               <circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" />
               <circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
            </svg>
         </button>
         <div class="min-w-0 flex-1">
            {@render children(it)}
         </div>
      </li>
   {/each}
</ul>
