<script lang="ts">
   import { education } from '@cv';
   import Section from '@/layout/Section.svelte';
   import { transformDate } from '@/utils/transformDate';
</script>

<Section title="Estudios">
   <ul>
      {#each education as { institution, startDate, endDate, area, studyType }}
         <li>
            <article>
               <header>
                  <div>
                     <h3>{area}</h3>
                  </div>

                  <time
                     >{`${transformDate(startDate)} - ${
                        endDate != null ? transformDate(endDate) : 'Actual'
                     }`}</time
                  >
               </header>

               <footer>
                  <div>
                     <p>{institution}</p>

                     <span>{studyType}</span>
                  </div>
               </footer>
            </article>
         </li>
      {/each}
   </ul>
</Section>

<style>
   ul {
      display: flex;
      flex-direction: column;
      gap: 38px;
   }

   article h3 {
      font-weight: 500;
      color: #111;
   }

   header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
   }

   time {
      color: #555;
      font-size: 0.775rem;
      min-width: 120px;
      font-weight: 600;
      text-align: end;
   }

   footer p {
      font-size: 0.75rem;
   }

   footer div {
      display: flex;
      justify-content: space-between;
      align-items: center;
   }

   span {
      align-items: center;
      background: #eee;
      border-radius: 6px;
      color: black;
      display: flex;
      font-size: 0.7rem;
      font-weight: 500;
      gap: 4px;
      padding: 0.2rem 0.6rem;
      width: fit-content;
   }

   @media (width <= 700px) {
      time {
         text-align: right;
      }
   }
</style>
