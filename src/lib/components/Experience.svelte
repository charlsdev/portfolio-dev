<script lang="ts">
   import { getCv } from '@/cv-context';
   import Section from '@/layout/Section.svelte';
   import { transformDate } from '@/utils/transformDate';

   const { work } = getCv();
</script>

<Section title="Experiencia" index="02">
   <ol class="relative ml-1 border-l border-line">
      {#each work as { name, startDate, endDate, position, summary, highlights, url }}
         <li class="relative ml-6 pb-10 last:pb-0">
            <span
               class="absolute -left-[1.85rem] top-1.5 size-3 rounded-full border-2
                      border-primary bg-bg"
               aria-hidden="true"
            ></span>

            <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
               <h3 class="font-display text-lg font-semibold">
                  {#if url}
                     <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="underline-offset-4 hover:text-primary hover:underline"
                     >
                        {name}
                     </a>
                  {:else}
                     {name}
                  {/if}
               </h3>
               <time
                  class="font-mono text-xs text-fg-tertiary"
               >
                  {transformDate(startDate)} — {endDate != null
                     ? transformDate(endDate)
                     : 'Actual'}
               </time>
            </div>

            <p class="mt-0.5 text-sm font-medium text-primary-deep dark:text-primary">
               {position}
            </p>

            <p class="mt-3 text-sm leading-relaxed text-fg-secondary">{summary}</p>

            {#if highlights.length}
               <ul class="mt-3 flex flex-wrap gap-2">
                  {#each highlights as h}
                     <li
                        class="rounded-md border border-line bg-surface px-2.5 py-1
                               font-mono text-xs text-fg-secondary"
                     >
                        {h}
                     </li>
                  {/each}
               </ul>
            {/if}
         </li>
      {/each}
   </ol>
</Section>
