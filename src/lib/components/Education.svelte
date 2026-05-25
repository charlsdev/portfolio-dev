<script lang="ts">
   import { getCv } from '@/cv-context';
   import Section from '@/layout/Section.svelte';
   import { transformDate } from '@/utils/transformDate';

   let { index = '' }: { index?: string } = $props();
   const { education } = getCv();
</script>

<Section title="Estudios" {index}>
   <ul class="flex flex-col gap-4">
      {#each education as { institution, startDate, endDate, area, studyType }}
         <li
            class="rounded-lg border border-line bg-surface p-5
                   transition-colors hover:border-line-strong"
         >
            <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
               <h3 class="font-display text-base font-semibold">{area}</h3>
               <time class="font-mono text-xs text-fg-tertiary">
                  {transformDate(startDate)} — {endDate != null
                     ? transformDate(endDate)
                     : 'Actual'}
               </time>
            </div>
            <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-fg-secondary">
               <span>{institution}</span>
               <span
                  class="rounded-sm bg-elevated px-2 py-0.5 font-mono text-xs text-fg-tertiary"
               >
                  {studyType}
               </span>
            </div>
         </li>
      {/each}
   </ul>
</Section>
