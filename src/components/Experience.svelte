<script lang="ts">
   import { work } from '@cv';
   import Section from '@/layout/Section.svelte';
</script>

<Section title="Experiencia laboral">
   <ul>
      {#each work as { name, startDate, endDate, position, summary, highlights, url }}
         <li>
            <article>
               <header>
                  <div>
                     <h3>
                        <a href={url} title={`Ver ${name}`} target="_blank">
                           {name}
                        </a>
                     </h3>
                     <h4>{position}</h4>
                  </div>

                  <time
                     >{`${new Date(startDate).getFullYear()} - ${
                        endDate != null
                           ? new Date(endDate).getFullYear()
                           : 'Actual'
                     }`}</time
                  >
               </header>

               <footer>
                  <p>{summary}</p>

                  <div>
                     {#if highlights.length}
                        {#each highlights as skill}
                           <span>{skill}</span>
                        {/each}
                     {/if}
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
      gap: 10px;
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
   }

   header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
   }

   time {
      color: #555;
      font-size: 0.85rem;
      min-width: 102px;
      font-weight: 600;
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
