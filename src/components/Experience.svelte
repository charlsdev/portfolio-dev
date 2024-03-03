<script lang="ts">
   import { work } from '@cv';
   import Section from '@/layout/Section.svelte';
   import { transformDate } from '@/utils/transformDate';
</script>

<Section title="Experiencia laboral">
   <ul>
      {#each work as { name, startDate, endDate, position, summary, highlights, url }}
         <li>
            <article>
               <header>
                  <div>
                     <h3>
                        {#if url}
                           <a href={url} title={`Ver ${name}`} target="_blank">
                              {name}
                           </a>
                        {:else}
                           {name}
                        {/if}
                     </h3>
                     <h4>{position}</h4>
                  </div>

                  <time
                     >{`${transformDate(startDate)} - ${
                        endDate != null ? `${transformDate(endDate)}` : 'Actual'
                     }`}</time
                  >
               </header>

               <footer>
                  <p>{summary}</p>

                  {#if highlights.length}
                     <div>
                        {#each highlights as skill}
                           <span>{skill}</span>
                        {/each}
                     </div>
                  {/if}
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

   article a {
      color: #111;
   }

   article a:hover {
      text-decoration: underline;
   }

   article h4 {
      color: #222;
      font-weight: 400;
      font-size: 0.875rem;
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
      min-width: 150px;
      font-weight: 600;
      text-align: end;
   }

   footer p {
      font-size: 0.8rem;
      margin-bottom: 8px;
   }

   footer div {
      display: inline-flex;
      gap: 8px;
      flex-wrap: wrap;
   }

   footer div span {
      align-items: center;
      background: #eee;
      border-radius: 6px;
      color: black;
      display: flex;
      font-size: 0.7rem;
      font-weight: 500;
      gap: 4px;
      padding: 0.2rem 0.6rem;
   }

   @media (width <= 700px) {
      time {
         text-align: right;
      }
   }
</style>
