<script lang="ts">
   import { getCv } from '@/cv-context'
   import Section from '@/layout/Section.svelte'

   let { index = '' }: { index?: string } = $props()
   const { publications } = getCv()
</script>

<Section title="Publicaciones" {index}>
      <ul class="flex flex-col gap-4">
         {#each publications as p}
            <li
               class="rounded-lg border border-line bg-surface p-5 transition-colors
                      hover:border-line-strong"
            >
               <h3 class="font-display text-base font-semibold">{p.title}</h3>
               <dl class="mt-2 flex flex-col gap-1 text-sm">
                  {#if p.journal}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Revista</dt>
                        <dd class="font-medium text-primary-deep dark:text-primary">{p.journal}</dd>
                     </div>
                  {/if}
                  {#if p.coauthors}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Coautores</dt>
                        <dd class="text-fg-secondary">{p.coauthors}</dd>
                     </div>
                  {/if}
                  {#if p.institution}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Institución</dt>
                        <dd class="text-fg-secondary">{p.institution}</dd>
                     </div>
                  {/if}
                  {#if p.year}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Año</dt>
                        <dd><span class="vbadge vbadge-amber vbadge-mono">{p.year}</span></dd>
                     </div>
                  {/if}
               </dl>
            </li>
         {/each}
      </ul>
</Section>
