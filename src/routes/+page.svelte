<script lang="ts">
   import type { Component } from 'svelte'
   import { setCv } from '@/cv-context'
   import About from '@/components/About.svelte'
   import Awards from '@/components/Awards.svelte'
   import Courses from '@/components/Courses.svelte'
   import Education from '@/components/Education.svelte'
   import Experience from '@/components/Experience.svelte'
   import Profile from '@/components/Profile.svelte'
   import Projects from '@/components/Projects.svelte'
   import Publications from '@/components/Publications.svelte'
   import Research from '@/components/Research.svelte'
   import Skills from '@/components/Skills.svelte'
   import Talks from '@/components/Talks.svelte'
   import ThemeToggle from '@/components/ThemeToggle.svelte'
   import Footer from '@/layout/Footer.svelte'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()

   // svelte-ignore state_referenced_locally
   setCv(data.cv)

   const basics = $derived(data.cv.basics)
   const title = $derived(`Portafolio de ${basics.name} | ${basics.summary}`)
   const domain = $derived(basics.url.split('//')[1] ?? '')

   const REG: Record<string, Component<{ index?: string }>> = {
      about: About,
      experience: Experience,
      education: Education,
      projects: Projects,
      courses: Courses,
      talks: Talks,
      publications: Publications,
      research: Research,
      awards: Awards,
      skills: Skills,
   }

   const hasData = (key: string): boolean => {
      const cv = data.cv
      switch (key) {
         case 'about':
            return !!cv.basics.summary?.trim()
         case 'experience':
            return cv.work.length > 0
         case 'education':
            return cv.education.length > 0
         case 'projects':
            return cv.projects.length > 0
         case 'courses':
            return cv.courses.length > 0
         case 'talks':
            return cv.talks.length > 0
         case 'publications':
            return cv.publications.length > 0
         case 'research':
            return cv.research.length > 0
         case 'awards':
            return cv.awards.length > 0
         case 'skills':
            return cv.skills.length > 0
         default:
            return false
      }
   }

   let mode = $state<'dev' | 'completo'>('dev')
   const visible = $derived(
      data.sections.filter((s) => (mode === 'completo' || s.inDev) && hasData(s.key)),
   )
   const pad = (n: number) => String(n).padStart(2, '0')
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

<header
   class="no-print sticky top-0 z-30 border-b border-line/60 bg-bg/80 backdrop-blur-md"
>
   <div class="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-6">
      <a href="/" aria-label="Inicio" class="flex items-center gap-2">
         <img src="/logo_primary.svg" alt="" class="h-6 w-6" />
         <span class="font-mono text-sm text-fg-tertiary">charlsdev</span>
      </a>

      <div class="flex items-center gap-2">
         <!-- Toggle Dev / Completo -->
         <div class="flex rounded-md border border-line p-0.5">
            <button
               type="button"
               onclick={() => (mode = 'dev')}
               class="rounded-[5px] px-2.5 py-1 text-xs font-semibold transition-colors
                      {mode === 'dev'
                  ? 'bg-primary text-ink'
                  : 'text-fg-tertiary hover:text-fg'}"
               aria-pressed={mode === 'dev'}
            >
               Dev
            </button>
            <button
               type="button"
               onclick={() => (mode = 'completo')}
               class="rounded-[5px] px-2.5 py-1 text-xs font-semibold transition-colors
                      {mode === 'completo'
                  ? 'bg-primary text-ink'
                  : 'text-fg-tertiary hover:text-fg'}"
               aria-pressed={mode === 'completo'}
            >
               Completo
            </button>
         </div>
         <ThemeToggle />
      </div>
   </div>
</header>

<main class="mx-auto w-full max-w-3xl px-6 py-12 md:py-20">
   <Profile />

   {#each visible as s, i (s.key)}
      {@const C = REG[s.key]}
      {#if C}
         <C index={pad(i + 1)} />
      {/if}
   {/each}

   <Footer {mode} />
</main>
