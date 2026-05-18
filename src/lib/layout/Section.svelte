<script lang="ts">
   import type { Snippet } from 'svelte'

   let {
      title = '',
      index = '',
      id = '',
      children,
   }: { title?: string; index?: string; id?: string; children?: Snippet } = $props()
</script>

<section {id} class="mx-auto mb-16 w-full max-w-3xl scroll-mt-28 md:mb-24">
   {#if title}
      <header class="mb-7 flex items-baseline gap-3">
         {#if index}
            <span class="font-mono text-sm font-medium text-primary-deep dark:text-primary">
               {index}
            </span>
         {/if}
         <h2 class="text-2xl font-bold md:text-[2rem]">{title}</h2>
         <span class="h-px flex-1 self-center bg-line"></span>
      </header>
   {/if}

   {@render children?.()}
</section>
