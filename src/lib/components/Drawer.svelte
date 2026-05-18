<script lang="ts">
   import type { Snippet } from 'svelte'
   import { fade, fly } from 'svelte/transition'

   let {
      open = $bindable(false),
      title,
      children,
      onclose,
   }: {
      open?: boolean
      title: string
      children: Snippet
      onclose?: () => void
   } = $props()

   let panel = $state<HTMLElement | null>(null)
   let restoreFocus: HTMLElement | null = null

   function close() {
      open = false
      onclose?.()
   }

   $effect(() => {
      if (!open) return
      restoreFocus = document.activeElement as HTMLElement | null
      document.body.style.overflow = 'hidden'
      // foco al primer campo del panel
      queueMicrotask(() => {
         const el = panel?.querySelector<HTMLElement>(
            'input,textarea,select,button,[tabindex]',
         )
         el?.focus()
      })
      return () => {
         document.body.style.overflow = ''
         restoreFocus?.focus?.()
      }
   })

   function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
         e.preventDefault()
         close()
      }
   }
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if open}
   <div class="fixed inset-0 z-50 flex justify-end">
      <button
         type="button"
         aria-label="Cerrar"
         class="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
         transition:fade={{ duration: 150 }}
         onclick={close}
      ></button>

      <div
         bind:this={panel}
         role="dialog"
         aria-modal="true"
         aria-label={title}
         transition:fly={{ x: 420, duration: 220, opacity: 1 }}
         class="relative flex h-full w-full max-w-md flex-col border-l border-line
                bg-surface shadow-lg"
      >
         <header
            class="flex items-center justify-between gap-3 border-b border-line
                   px-5 py-4"
         >
            <h2 class="font-display text-base font-semibold text-fg">{title}</h2>
            <button
               type="button"
               onclick={close}
               aria-label="Cerrar"
               class="grid size-8 place-items-center rounded-md text-fg-tertiary
                      transition-colors hover:bg-elevated hover:text-fg"
            >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
               </svg>
            </button>
         </header>

         <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {@render children()}
         </div>
      </div>
   </div>
{/if}
