<script lang="ts">
   import { basics } from '@cv';
   import Section from '@/layout/Section.svelte';

   const { summary } = basics;
</script>

<Section title="Sobre mí">
   <p>
      {summary}
   </p>
</Section>

<style>
   p {
      font-size: 0.8rem;
   }
</style>
