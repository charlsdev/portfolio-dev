<script lang="ts">
   import { getCv } from '@/cv-context'
   import Section from '@/layout/Section.svelte'

   let { index = '' }: { index?: string } = $props()
   const { talks } = getCv()
</script>

<Section title="Ponencias" {index}>
      <ul class="flex flex-col gap-4">
         {#each talks as t}
            <li
               class="rounded-lg border border-line bg-surface p-5 transition-colors
                      hover:border-line-strong"
            >
               <h3 class="font-display text-base font-semibold">{t.title}</h3>
               <dl class="mt-2 flex flex-col gap-1 text-sm">
                  {#if t.congress}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Congreso</dt>
                        <dd class="font-medium text-primary-deep dark:text-primary">{t.congress}</dd>
                     </div>
                  {/if}
                  {#if t.institution}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Institución</dt>
                        <dd class="font-semibold text-fg-secondary">{t.institution}</dd>
                     </div>
                  {/if}
                  {#if t.location}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Lugar</dt>
                        <dd class="text-fg-secondary">{t.location}</dd>
                     </div>
                  {/if}
                  {#if t.dates}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Fechas</dt>
                        <dd><span class="vbadge vbadge-amber vbadge-mono">{t.dates}</span></dd>
                     </div>
                  {/if}
               </dl>
            </li>
         {/each}
      </ul>
</Section>
