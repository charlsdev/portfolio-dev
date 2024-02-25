<script lang="ts">
   import { skills } from '@cv';
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
</script>

<Section title="Habilidades">
   <ul>
      {#each skills as { name, description }}
         <li>
            <svelte:component this={SKILLS_ICONS[name]} />
            <span>{description}</span>
         </li>
      {/each}
   </ul>
</Section>

<style>
   ul {
      display: inline-flex;
      gap: 8px;
      flex-wrap: wrap;
   }

   li {
      align-items: center;
      background: #eee;
      border-radius: 6px;
      color: black;
      display: flex;
      font-size: 0.8rem;
      font-weight: 500;
      gap: 4px;
      padding: 0.2rem 0.6rem;
   }
</style>
