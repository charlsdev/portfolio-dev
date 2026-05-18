<script lang="ts">
   import { getCv } from '@/cv-context';
   import Section from '@/layout/Section.svelte';

   const { summary } = getCv().basics;
</script>

<Section title="Sobre mí" index="01">
   <p class="max-w-2xl text-sm leading-relaxed text-fg-secondary md:text-base">
      {summary}
   </p>
</Section>
