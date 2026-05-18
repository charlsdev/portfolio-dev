<script lang="ts">
   import { setCv } from '@/cv-context'
   import About from '@/components/About.svelte'
   import Education from '@/components/Education.svelte'
   import Experience from '@/components/Experience.svelte'
   import Profile from '@/components/Profile.svelte'
   import Projects from '@/components/Projects.svelte'
   import Skills from '@/components/Skills.svelte'
   import ThemeToggle from '@/components/ThemeToggle.svelte'
   import Footer from '@/layout/Footer.svelte'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()

   // El CV se inyecta una vez al montar (es estable por carga SSR; una
   // navegación re-monta el componente y vuelve a setear el contexto).
   // svelte-ignore state_referenced_locally
   setCv(data.cv)

   const basics = $derived(data.cv.basics)
   const title = $derived(`Portafolio de ${basics.name} | ${basics.summary}`)
   const domain = $derived(basics.url.split('//')[1] ?? '')
</script>

<svelte:head>
   <title>{title}</title>
   <meta name="description" content={basics.summary} />
   <link rel="preload" as="image" href={basics.image} />

   <meta property="og:url" content={basics.url} />
   <meta property="og:type" content="website" />
   <meta property="og:title" content={title} />
   <meta property="og:description" content={basics.summary} />
   <meta property="og:image" content={basics.image} />

   <meta name="twitter:card" content="summary_large_image" />
   <meta property="twitter:domain" content={domain} />
   <meta property="twitter:url" content={basics.url} />
   <meta name="twitter:title" content={title} />
   <meta name="twitter:description" content={basics.summary} />
   <meta name="twitter:image" content={basics.image} />
</svelte:head>

<!-- Topbar minimal: isotipo de marca + toggle de tema -->
<header
   class="no-print sticky top-0 z-30 border-b border-line/60 bg-bg/80 backdrop-blur-md"
>
   <div class="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-6">
      <a href="/" aria-label="Inicio" class="flex items-center gap-2">
         <img src="/logo_primary.svg" alt="" class="h-6 w-6" />
         <span class="font-mono text-sm text-fg-tertiary">charlsdev</span>
      </a>
      <ThemeToggle />
   </div>
</header>

<main class="mx-auto w-full max-w-3xl px-6 py-12 md:py-20">
   <Profile />
   <About />
   <Experience />
   <Education />
   <Projects />
   <Skills />

   <Footer />
</main>
