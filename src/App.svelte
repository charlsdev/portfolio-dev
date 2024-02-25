<script lang="ts">
   import { basics } from '@cv';
   import Profile from '@/components/Profile.svelte';
   import Skills from '@/components/Skills.svelte';
   import About from '@/components/About.svelte';
   import Experience from '@/components/Experience.svelte';
   import Education from '@/components/Education.svelte';
   import Projects from '@/components/Projects.svelte';
   import Footer from '@/layout/Footer.svelte';

   const { image, summary, url, name } = basics;

   let title = `Portafolio de ${name} | ${summary}`;
</script>

<svelte:head>
   <meta charset="UTF-8" />
   <title>{title}</title>
   <meta name="description" content={summary} />
   <meta name="viewport" content="width=device-width" />
   <link rel="icon" type="image/svg+xml" href="/logo.ico" />
   <link rel="preload" as="image" href={image} />

   <meta property="og:url" content={url} />
   <meta property="og:type" content="website" />
   <meta property="og:title" content={title} />
   <meta property="og:description" content={summary} />
   <meta property="og:image" content="" />

   <meta name="twitter:card" content="summary_large_image" />
   <meta property="twitter:domain" content={url.split('//')[1] ?? ''} />
   <meta property="twitter:url" content={url} />
   <meta name="twitter:title" content={title} />
   <meta name="twitter:description" content={summary} />
   <meta name="twitter:image" content="" />
</svelte:head>

<main>
   <Profile />
   <About />
   <Experience />
   <Education />
   <Projects />
   <Skills />

   <Footer />
</main>

<style>
   main {
      padding: 2rem 4rem;
      margin: auto;
      width: 100%;
   }

   @media (width <= 700px) {
      main {
         padding: 2rem;
      }
   }
</style>
