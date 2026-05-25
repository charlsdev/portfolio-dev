<script lang="ts">
   import { getCv } from '@/cv-context'
   import Section from '@/layout/Section.svelte'
   import { transformDate } from '@/utils/transformDate'

   let { index = '' }: { index?: string } = $props()
   const { courses } = getCv()

   const range = (s: string | null, e: string | null) => {
      const a = s ? transformDate(s) : ''
      const b = e ? transformDate(e) : ''
      if (a && b) return `${a} — ${b}`
      return a || b
   }
</script>

<Section title="Cursos y capacitaciones" {index}>
      <ul class="flex flex-col gap-4">
         {#each courses as c}
            <li
               class="rounded-lg border border-line bg-surface p-5 transition-colors
                      hover:border-line-strong"
            >
               <h3 class="font-display text-base font-semibold">{c.title}</h3>
               <dl class="mt-2 flex flex-col gap-1 text-sm">
                  {#if c.institution}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Institución</dt>
                        <dd class="font-medium text-primary-deep dark:text-primary">{c.institution}</dd>
                     </div>
                  {/if}
                  {#if c.hours}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Horas</dt>
                        <dd class="text-fg-secondary">{c.hours}</dd>
                     </div>
                  {/if}
                  {#if c.location}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Lugar</dt>
                        <dd class="text-fg-secondary">{c.location}</dd>
                     </div>
                  {/if}
                  {#if range(c.startDate, c.endDate)}
                     <div class="flex gap-2">
                        <dt class="w-24 shrink-0 font-mono text-xs text-fg-tertiary">Fechas</dt>
                        <dd><span class="vbadge vbadge-amber vbadge-mono">{range(c.startDate, c.endDate)}</span></dd>
                     </div>
                  {/if}
               </dl>
            </li>
         {/each}
      </ul>
</Section>
