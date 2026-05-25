<script lang="ts">
   import { getCv } from '@/cv-context'
   import Section from '@/layout/Section.svelte'

   let { index = '' }: { index?: string } = $props()
   const { research } = getCv()

   const years = (s: number | null, e: number | null) => {
      if (s != null && e != null) return s === e ? `${s}` : `${s} – ${e}`
      return s != null ? `${s}` : e != null ? `${e}` : ''
   }
</script>

<Section title="Investigaciones" {index}>
      <ul class="flex flex-col gap-4">
         {#each research as r}
            <li
               class="rounded-lg border border-line bg-surface p-5 transition-colors
                      hover:border-line-strong"
            >
               <h3 class="font-display text-base font-semibold">{r.title}</h3>
               <dl class="mt-2 flex flex-col gap-1 text-sm">
                  {#if r.institution}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Institución</dt>
                        <dd class="font-medium text-primary-deep dark:text-primary">{r.institution}</dd>
                     </div>
                  {/if}
                  {#if r.authors}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Autores</dt>
                        <dd class="text-fg-secondary">{r.authors}</dd>
                     </div>
                  {/if}
                  {#if years(r.startYear, r.endYear)}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Años</dt>
                        <dd><span class="vbadge vbadge-amber vbadge-mono">{years(r.startYear, r.endYear)}</span></dd>
                     </div>
                  {/if}
               </dl>
            </li>
         {/each}
      </ul>
</Section>
