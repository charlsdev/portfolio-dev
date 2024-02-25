<script lang="ts">
   export let title: string = '';
</script>

<section>
   {#if title}
      <h2>{title}</h2>
   {/if}

   <slot />
</section>

<style>
   section {
      max-width: 700px;
      margin: 0 auto 38px;
   }

   h2 {
      margin-bottom: 8px;
      font-weight: 700;
      line-height: 1.5;
      font-size: 1.5rem;
   }

   @media (width <= 700px) {
      section {
         margin-bottom: 38px;
      }
   }
</style>
