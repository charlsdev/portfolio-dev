<script lang="ts">
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()

   const cards = $derived([
      { href: '/admin/basics', label: 'Datos básicos', n: null },
      { href: '/admin/profiles', label: 'Redes', n: data.counts.profiles },
      { href: '/admin/work', label: 'Experiencia', n: data.counts.work },
      { href: '/admin/education', label: 'Estudios', n: data.counts.education },
      { href: '/admin/projects', label: 'Proyectos', n: data.counts.projects },
      { href: '/admin/skills', label: 'Habilidades', n: data.counts.skills },
      { href: '/admin/languages', label: 'Idiomas', n: data.counts.languages },
   ])
</script>

<svelte:head><title>Admin · Inicio</title></svelte:head>

<p class="eyebrow mb-2">Panel</p>
<h1 class="font-display text-2xl font-bold text-fg">Contenido del portfolio</h1>
<p class="mt-2 mb-8 max-w-prose text-sm text-fg-secondary">
   Editá cada sección. Los cambios se reflejan al instante en el sitio público.
</p>

<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
   {#each cards as c}
      <a
         href={c.href}
         class="group flex items-center justify-between rounded-lg border border-line
                bg-surface p-4 transition-all hover:-translate-y-0.5
                hover:border-primary hover:shadow-sm"
      >
         <span class="text-sm font-medium text-fg group-hover:text-primary-deep
                      dark:group-hover:text-primary">
            {c.label}
         </span>
         {#if c.n !== null}
            <span
               class="rounded-full bg-elevated px-2 py-0.5 font-mono text-xs text-fg-tertiary"
            >
               {c.n}
            </span>
         {/if}
      </a>
   {/each}
</div>
