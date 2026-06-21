<script lang="ts">
   import { getCv } from '@/cv-context';
   import Section from '@/layout/Section.svelte';
   import GitHub from '@/icons/git-hub.svelte';

   let { index = '' }: { index?: string } = $props();
   const { projects } = getCv();

   // Estado de expansión por tarjeta: clave = índice.
   let expanded = $state<Record<number, boolean>>({});
   const toggle = (i: number) => (expanded[i] = !expanded[i]);
</script>

<Section title="Proyectos" {index}>
   <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {#each projects as { name, description, isActive, github, highlights, url }, i}
         <li>
            <article
               class="group flex h-full flex-col gap-4 rounded-lg border border-line
                      bg-surface p-5 transition-all hover:-translate-y-0.5
                      hover:border-primary hover:shadow-md"
            >
               <header class="flex-1">
                  <div class="flex items-start justify-between gap-3">
                     <h3 class="font-display text-base font-semibold">
                        {#if url}
                           <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Ver ${name}`}
                              class="inline-flex items-center gap-1.5 underline-offset-4
                                     group-hover:text-primary hover:underline"
                           >
                              {name}
                              {#if isActive}
                                 <span
                                    class="size-2 rounded-full bg-success shadow-[0_0_8px] shadow-success"
                                    title="Activo"
                                    aria-label="Activo"
                                 ></span>
                              {/if}
                           </a>
                        {:else}
                           {name}
                        {/if}
                     </h3>

                     {#if github}
                        <a
                           href={github}
                           target="_blank"
                           rel="noopener noreferrer"
                           title={`Código de ${name}`}
                           class="shrink-0 text-fg-tertiary transition-colors hover:text-primary"
                        >
                           <GitHub />
                        </a>
                     {/if}
                  </div>
                  <p
                     class="mt-2 text-sm leading-relaxed text-fg-secondary"
                     class:line-clamp-4={!expanded[i]}
                     title={description}
                  >
                     {description}
                  </p>
                  {#if description.length > 180}
                     <button
                        type="button"
                        onclick={() => toggle(i)}
                        class="mt-2 font-mono text-xs text-primary-deep
                               transition-colors hover:underline dark:text-primary"
                     >
                        {expanded[i] ? 'Ver menos ↑' : 'Ver más ↓'}
                     </button>
                  {/if}
               </header>

               {#if highlights.length}
                  <footer class="flex flex-wrap gap-1.5">
                     {#each highlights as h}
                        <span
                           class="rounded-sm border border-accent/30 bg-accent/5 px-2 py-0.5
                                  font-mono text-[0.7rem] text-fg-secondary"
                        >
                           {h}
                        </span>
                     {/each}
                  </footer>
               {/if}
            </article>
         </li>
      {/each}
   </ul>
</Section>
