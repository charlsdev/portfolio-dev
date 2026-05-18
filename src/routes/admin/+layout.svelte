<script lang="ts">
   import { page } from '$app/state'
   import ThemeToggle from '@/components/ThemeToggle.svelte'
   import '../../admin.css'

   let { children, data } = $props()

   const isLogin = $derived(page.url.pathname === '/admin/login')

   const nav = [
      { href: '/admin', label: 'Inicio' },
      { href: '/admin/basics', label: 'Datos básicos' },
      { href: '/admin/profiles', label: 'Redes' },
      { href: '/admin/work', label: 'Experiencia' },
      { href: '/admin/education', label: 'Estudios' },
      { href: '/admin/projects', label: 'Proyectos' },
      { href: '/admin/skills', label: 'Habilidades' },
      { href: '/admin/languages', label: 'Idiomas' },
      { href: '/admin/users', label: 'Usuarios' },
   ]
</script>

{#if isLogin}
   {@render children()}
{:else}
   <div class="grid min-h-dvh grid-cols-1 bg-bg md:grid-cols-[240px_1fr]">
      <aside
         class="flex flex-col gap-1 border-b border-line bg-surface p-4 md:border-b-0
                md:border-r"
      >
         <div class="mb-5 flex items-center gap-2.5 px-2 pt-1">
            <img src="/logo_primary.svg" alt="" class="size-7" />
            <div class="leading-tight">
               <p class="font-display text-sm font-bold text-fg">charlsdev</p>
               <p class="font-mono text-[0.65rem] text-fg-tertiary">admin</p>
            </div>
         </div>

         <nav class="flex flex-row flex-wrap gap-1 md:flex-col">
            {#each nav as item}
               <a
                  href={item.href}
                  aria-current={page.url.pathname === item.href ? 'page' : undefined}
                  class="rounded-md px-3 py-2 text-sm text-fg-secondary transition-colors
                         hover:bg-elevated aria-[current=page]:bg-primary
                         aria-[current=page]:font-semibold aria-[current=page]:text-ink"
               >
                  {item.label}
               </a>
            {/each}
         </nav>

         {#if data?.me}
            <div class="mt-auto flex items-center gap-2 px-2 pb-2 pt-4">
               <span
                  class="grid size-7 shrink-0 place-items-center rounded-full bg-primary
                         font-mono text-xs font-bold text-ink"
               >
                  {data.me.fullName.trim().charAt(0).toUpperCase() || 'U'}
               </span>
               <span class="truncate text-xs text-fg-secondary" title={data.me.fullName}>
                  {data.me.fullName}
               </span>
            </div>
         {/if}

         <div class="flex items-center gap-2 {data?.me ? '' : 'mt-auto pt-4'}">
            <form method="POST" action="/admin/logout" class="flex-1">
               <button
                  type="submit"
                  class="w-full rounded-md border border-line px-3 py-2 text-xs
                         text-fg-tertiary transition-colors hover:border-error
                         hover:text-error"
               >
                  Cerrar sesión
               </button>
            </form>
            <ThemeToggle />
         </div>
         <a
            href="/"
            target="_blank"
            class="mt-1 text-center font-mono text-[0.7rem] text-fg-tertiary
                   hover:text-primary"
         >
            Ver sitio ↗
         </a>
      </aside>

      <main class="w-full px-6 py-8 md:px-10 md:py-10">
         <div class="mx-auto max-w-3xl">
            {@render children()}
         </div>
      </main>
   </div>
{/if}
