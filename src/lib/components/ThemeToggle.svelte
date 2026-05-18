<script lang="ts">
   import { onMount } from 'svelte'

   let theme = $state<'light' | 'dark'>('light')

   onMount(() => {
      theme = (document.documentElement.dataset.theme as 'light' | 'dark') ?? 'light'
   })

   function toggle() {
      theme = theme === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.theme = theme
      try {
         localStorage.setItem('theme', theme)
      } catch {}
   }
</script>

<button
   type="button"
   onclick={toggle}
   class="grid size-9 place-items-center rounded-md border border-line text-fg-secondary
          transition-colors hover:border-primary hover:text-primary"
   aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
   title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
>
   {#if theme === 'dark'}
      <!-- sol -->
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
         <circle cx="12" cy="12" r="4" />
         <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
   {:else}
      <!-- luna -->
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
         <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
   {/if}
</button>
