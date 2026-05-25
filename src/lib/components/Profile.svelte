<script lang="ts">
   import GitHub from '@/icons/GitHub.svelte';
   import LinkedIn from '@/icons/LinkedIn.svelte';
   import X from '@/icons/X.svelte';
   import Mail from '@/icons/Mail.svelte';
   import Phone from '@/icons/Phone.svelte';
   import WorldMap from '@/icons/WorldMap.svelte';
   import Translate from '@/icons/translate.svelte';

   import { getCv } from '@/cv-context';
   import type { SocialIcon } from '@/types';

   const { basics, languages } = getCv();
   const { name, label, image, location, profiles, phone, email } = basics;
   const { city, region } = location;

   const SOCIAL_ICONS: SocialIcon = { GitHub, LinkedIn, X };

   const linkedUrl = profiles.find(({ network }) => network === 'LinkedIn')?.url;
   const printInfo = [email, phone, linkedUrl].filter(Boolean).join(' • ');
</script>

<section class="mb-16 scroll-mt-28 md:mb-24">
   <div class="flex flex-col-reverse items-start gap-8 md:flex-row md:items-center md:justify-between">
      <div class="flex flex-col gap-4">
         <p class="eyebrow">Full Stack Developer</p>

         <h1
            class="font-display font-bold leading-[0.95] tracking-tight
                   text-[clamp(2.75rem,8vw,4.5rem)]"
         >
            {name}
         </h1>

         <h2 class="max-w-xl text-base font-normal text-fg-secondary md:text-lg">
            {label}
         </h2>

         <div class="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-tertiary">
            <span class="flex items-center gap-1.5">
               <WorldMap />
               <span class="font-mono">{city}, {region}</span>
            </span>
            <span class="flex items-center gap-1.5">
               <Translate />
               {#each languages as { language, fluency }}
                  <span class="font-mono text-accent">{language}</span>
                  <span class="text-fg-tertiary">({fluency})</span>
               {/each}
            </span>
         </div>

         <footer class="print mt-2 font-mono text-xs text-fg-tertiary">{printInfo}</footer>

         <footer class="no-print mt-3 flex flex-wrap gap-2">
            {#if email}
               <a
                  href={`mailto:${email}`}
                  title={`Escribir a ${name}`}
                  class="grid size-10 place-items-center rounded-md border border-line
                         text-fg-secondary transition-colors hover:border-primary hover:text-primary"
               >
                  <Mail />
               </a>
            {/if}
            {#if phone}
               <a
                  href={`tel:${phone}`}
                  title={`Llamar a ${name}`}
                  class="grid size-10 place-items-center rounded-md border border-line
                         text-fg-secondary transition-colors hover:border-primary hover:text-primary"
               >
                  <Phone />
               </a>
            {/if}
            {#each profiles as { network, url }}
               <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${name} en ${network}`}
                  class="grid size-10 place-items-center rounded-md border border-line
                         text-fg-secondary transition-colors hover:border-primary hover:text-primary"
               >
                  <svelte:component this={SOCIAL_ICONS[network]} />
               </a>
            {/each}
         </footer>
      </div>

      <figure class="relative shrink-0">
         <div
            class="absolute -inset-2 -z-10 rounded-2xl bg-primary/20 blur-2xl"
            aria-hidden="true"
         ></div>
         <img
            src={image}
            alt={name}
            class="aspect-[3/4] w-44 rounded-2xl object-cover object-top md:w-56"
         />
      </figure>
   </div>
</section>
