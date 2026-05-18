<script lang="ts">
   const year = new Date().getFullYear();
</script>

<footer
   class="no-print mx-auto mt-8 flex w-full max-w-3xl flex-col items-center gap-4
          border-t border-line pt-8 sm:flex-row sm:justify-between"
>
   <div class="flex items-center gap-2 text-fg-tertiary">
      <img src="/logo_primary.svg" alt="" class="h-5 w-5" />
      <span class="font-mono text-xs">&copy; {year} charlsdev</span>
   </div>

   <a
      href="/cv"
      class="inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5
             font-mono text-xs text-fg-secondary transition-colors
             hover:border-primary hover:text-primary"
      aria-label="Ver CV para descargar en PDF"
      title="Abrir CV imprimible / guardar como PDF"
   >
      <svg
         width="15"
         height="15"
         viewBox="0 0 24 24"
         stroke-width="1.8"
         stroke="currentColor"
         fill="none"
         stroke-linecap="round"
         stroke-linejoin="round"
      >
         <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
         <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
         <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
      </svg>
      Descargar PDF
   </a>
</footer>
