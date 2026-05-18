<script lang="ts">
   import { getCv } from '@/cv-context';
   import Section from '@/layout/Section.svelte';

   import HTML from '@/icons/html.svelte';
   import CSS from '@/icons/css.svelte';
   import JavaScript from '@/icons/javascript.svelte';
   import TypeScript from '@/icons/typescript.svelte';
   import React from '@/icons/react.svelte';
   import Node from '@/icons/node.svelte';
   import MySQL from '@/icons/mysql.svelte';
   import Git from '@/icons/git.svelte';
   import GitHub from '@/icons/git-hub.svelte';
   import NextJS from '@/icons/nextjs.svelte';
   import Tailwind from '@/icons/tailwind.svelte';
   import Svelte from '@/icons/svelte.svelte';
   import PostgreSQL from '@/icons/postgresql.svelte';
   import MongoDB from '@/icons/mongodb.svelte';
   import Docker from '@/icons/docker.svelte';
   import Prisma from '@/icons/prisma.svelte';
   import GraphQL from '@/icons/graphql.svelte';
   import Hono from '@/icons/hono.svelte';
   import Astro from '@/icons/astro.svelte';
   import Hana from '@/icons/sap.svelte';
   import ReactQuery from '@/icons/react-query.svelte';
   import Redis from '@/icons/redis.svelte';
   import PHP from '@/icons/php.svelte';

   const SKILLS_ICONS: Record<string, any> = {
      HTML,
      CSS,
      JavaScript,
      TypeScript,
      React,
      Node,
      MySQL,
      Git,
      GitHub,
      NextJS,
      Tailwind,
      Svelte,
      PostgreSQL,
      MongoDB,
      Docker,
      Prisma,
      GraphQL,
      Hono,
      Astro,
      Hana,
      ReactQuery,
      Redis,
      PHP,
   };

   const { skills } = getCv();
</script>

<Section title="Habilidades" index="05">
   <ul class="flex flex-wrap gap-2">
      {#each skills as { name, description }}
         <li
            class="flex items-center gap-2 rounded-md border border-line bg-surface
                   px-3 py-1.5 text-sm font-medium text-fg-secondary transition-colors
                   hover:border-primary hover:text-fg"
         >
            {#if SKILLS_ICONS[name]}
               <span class="grid size-4 place-items-center [&_svg]:size-4">
                  <svelte:component this={SKILLS_ICONS[name]} />
               </span>
            {/if}
            <span class="font-mono text-xs">{description}</span>
         </li>
      {/each}
   </ul>
</Section>
