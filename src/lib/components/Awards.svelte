<script lang="ts">
   import { getCv } from '@/cv-context'
   import Section from '@/layout/Section.svelte'

   let { index = '' }: { index?: string } = $props()
   const { awards } = getCv()

   const years = (s: number | null, e: number | null) => {
      if (s != null && e != null) return s === e ? `${s}` : `${s} – ${e}`
      return s != null ? `${s}` : e != null ? `${e}` : ''
   }
</script>

<Section title="Méritos y distinciones" {index}>
      <ul class="flex flex-col gap-4">
         {#each awards as a}
            <li
               class="rounded-lg border border-line bg-surface p-5 transition-colors
                      hover:border-line-strong"
            >
               <h3 class="font-display text-base font-semibold">{a.title}</h3>
               <dl class="mt-2 flex flex-col gap-1 text-sm">
                  {#if a.institution}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Institución</dt>
                        <dd class="text-fg-secondary">{a.institution}</dd>
                     </div>
                  {/if}
                  {#if years(a.startYear, a.endYear)}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Años</dt>
                        <dd><span class="vbadge vbadge-amber vbadge-mono">{years(a.startYear, a.endYear)}</span></dd>
                     </div>
                  {/if}
               </dl>
            </li>
         {/each}
      </ul>
</Section>
