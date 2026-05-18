<script lang="ts">
   import { onMount } from 'svelte'
   import { transformDate } from '@/utils/transformDate'
   import type { PageData } from './$types'

   let { data }: { data: PageData } = $props()
   const cv = $derived(data.cv)
   const b = $derived(cv.basics)

   const contactLine = $derived(
      [
         b.email,
         b.phone,
         [b.location?.city, b.location?.region].filter(Boolean).join(', '),
         b.url?.replace(/^https?:\/\//, ''),
      ].filter(Boolean),
   )

   const today = new Intl.DateTimeFormat('es', {
      month: 'long',
      year: 'numeric',
   }).format(new Date())

   // En un CV impreso una URL cruda larga no aporta y desborda: mostrar dominio.
   const host = (u?: string) => {
      if (!u) return ''
      try {
         return new URL(u).hostname.replace(/^www\./, '')
      } catch {
         return u.replace(/^https?:\/\//, '').split('/')[0]
      }
   }

   // Llega desde "Descargar PDF": abre el diálogo cuando las fuentes están listas
   onMount(async () => {
      try {
         await document.fonts?.ready
      } catch {}
      setTimeout(() => window.print(), 300)
   })
</script>

<svelte:head>
   <title>CV — {b.name}</title>
   <meta name="robots" content="noindex" />
</svelte:head>

<div class="backdrop">
   <div class="toolbar no-print">
      <a href="/" class="tbtn ghost">← Volver al sitio</a>
      <button type="button" class="tbtn" onclick={() => window.print()}>
         Guardar como PDF
      </button>
   </div>

   <article class="sheet">
      <!-- HEADER -->
      <header class="head">
         <div class="head-main">
            <p class="eyebrow">Curriculum Vitae</p>
            <h1>{b.name}</h1>
            {#if b.label}<p class="role">{b.label}</p>{/if}
            <ul class="contact">
               {#each contactLine as c}<li>{c}</li>{/each}
            </ul>
            {#if b.profiles?.length}
               <ul class="links">
                  {#each b.profiles as p}
                     <li><span class="net">{p.network}</span>{host(p.url)}</li>
                  {/each}
               </ul>
            {/if}
         </div>
         {#if b.image}
            <img class="photo" src={b.image} alt={b.name} />
         {/if}
      </header>

      {#if b.summary}
         <section class="block">
            <h2><span class="num">01</span> Perfil</h2>
            <p class="summary">{b.summary}</p>
         </section>
      {/if}

      {#if cv.work?.length}
         <section class="block">
            <h2><span class="num">02</span> Experiencia</h2>
            <ol class="timeline">
               {#each cv.work as w}
                  <li>
                     <span class="dot" aria-hidden="true"></span>
                     <div class="t-head">
                        <span class="t-title">{w.name}</span>
                        <span class="dates">
                           {transformDate(w.startDate)} — {w.endDate != null
                              ? transformDate(w.endDate)
                              : 'Actual'}
                        </span>
                     </div>
                     {#if w.position}<p class="t-sub">{w.position}</p>{/if}
                     {#if w.summary}<p class="desc">{w.summary}</p>{/if}
                     {#if w.highlights?.length}
                        <ul class="tags">
                           {#each w.highlights as h}<li>{h}</li>{/each}
                        </ul>
                     {/if}
                  </li>
               {/each}
            </ol>
         </section>
      {/if}

      {#if cv.projects?.length}
         <section class="block">
            <h2><span class="num">03</span> Proyectos</h2>
            <div class="proj-grid">
               {#each cv.projects as pr}
                  <div class="proj">
                     <div class="proj-head">
                        <span class="proj-name">{pr.name}</span>
                        {#if pr.url}
                           <span class="proj-url">{host(pr.url)}</span>
                        {/if}
                     </div>
                     {#if pr.description}<p class="desc">{pr.description}</p>{/if}
                     {#if pr.highlights?.length}
                        <p class="proj-tech">{pr.highlights.join(' · ')}</p>
                     {/if}
                  </div>
               {/each}
            </div>
         </section>
      {/if}

      {#if cv.education?.length}
         <section class="block">
            <h2><span class="num">04</span> Estudios</h2>
            <ol class="timeline">
               {#each cv.education as e}
                  <li>
                     <span class="dot" aria-hidden="true"></span>
                     <div class="t-head">
                        <span class="t-title">{e.area}</span>
                        <span class="dates">
                           {transformDate(e.startDate)} — {e.endDate != null
                              ? transformDate(e.endDate)
                              : 'Actual'}
                        </span>
                     </div>
                     <p class="t-sub">
                        {e.institution}{#if e.studyType} · {e.studyType}{/if}
                     </p>
                  </li>
               {/each}
            </ol>
         </section>
      {/if}

      <div class="two-col">
         {#if cv.skills?.length}
            <section class="block">
               <h2><span class="num">05</span> Habilidades</h2>
               <ul class="chips">
                  {#each cv.skills as s}<li>{s.description || s.name}</li>{/each}
               </ul>
            </section>
         {/if}
         {#if cv.languages?.length}
            <section class="block">
               <h2><span class="num">06</span> Idiomas</h2>
               <ul class="chips">
                  {#each cv.languages as l}<li>{l.language} · {l.fluency}</li>{/each}
               </ul>
            </section>
         {/if}
      </div>

      <footer class="doc-foot">
         {b.url?.replace(/^https?:\/\//, '') || 'charlsdev'} · Actualizado {today}
      </footer>
   </article>
</div>

<style>
   :global(html[data-theme]) {
      color-scheme: light;
   }

   .backdrop {
      min-height: 100dvh;
      background: #e9e9e4;
      padding: 2rem 1rem 4rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
   }

   .toolbar {
      display: flex;
      gap: 0.6rem;
      width: 100%;
      max-width: 820px;
      justify-content: flex-end;
   }
   .tbtn {
      font-family: var(--font-sans);
      font-size: 0.82rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      border: 1px solid transparent;
      background: #f5b544;
      color: #0a0a0b;
      cursor: pointer;
      text-decoration: none;
   }
   .tbtn.ghost {
      background: transparent;
      border-color: #b9b9b2;
      color: #4a4a4f;
   }

   .sheet {
      width: 100%;
      max-width: 820px;
      background: #fff;
      color: #1a1a1c;
      padding: 3.25rem 3.25rem 2.5rem;
      border-radius: 4px;
      box-shadow: 0 12px 32px rgba(10, 10, 11, 0.12);
      font-family: var(--font-sans);
      font-size: 10pt;
      line-height: 1.5;
      overflow-wrap: anywhere;
   }

   /* HEADER */
   .head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
      padding-bottom: 1.1rem;
      border-bottom: 2.5px solid #f5b544;
      margin-bottom: 1.6rem;
   }
   .eyebrow {
      font-size: 7.5pt;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #c8893a;
      margin-bottom: 0.35rem;
   }
   .head h1 {
      font-family: var(--font-display);
      font-size: 26pt;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1;
      color: #0a0a0b;
   }
   .role {
      color: #4a4a4f;
      font-size: 10.5pt;
      margin-top: 0.4rem;
      max-width: 46ch;
   }
   .contact {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.15rem 0.9rem;
      margin-top: 0.7rem;
      font-family: var(--font-mono);
      font-size: 8pt;
      color: #4a4a4f;
   }
   .contact li {
      position: relative;
   }
   .contact li + li::before {
      content: '·';
      position: absolute;
      left: -0.55rem;
      color: #b9b9b2;
   }
   .links {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.15rem 0.9rem;
      margin-top: 0.3rem;
      font-family: var(--font-mono);
      font-size: 8pt;
      color: #4a4a4f;
   }
   .net {
      color: #c8893a;
      font-weight: 500;
      margin-right: 0.35rem;
   }
   .photo {
      width: 92px;
      height: 92px;
      object-fit: cover;
      border-radius: 10px;
      flex-shrink: 0;
   }

   /* SECTIONS */
   .block {
      margin-bottom: 1.5rem;
      break-inside: avoid;
   }
   .block h2 {
      font-family: var(--font-sans);
      font-size: 9pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #0a0a0b;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid #e2e2dc;
      margin-bottom: 0.85rem;
      display: flex;
      align-items: baseline;
      gap: 0.55rem;
   }
   .num {
      font-family: var(--font-mono);
      font-size: 8pt;
      color: #c8893a;
      font-weight: 500;
   }
   .summary {
      color: #1a1a1c;
   }

   /* TIMELINE */
   .timeline {
      list-style: none;
      position: relative;
      margin-left: 0.4rem;
      padding-left: 1.25rem;
      border-left: 1.5px solid #e2e2dc;
   }
   .timeline > li {
      position: relative;
      padding-bottom: 1rem;
      break-inside: avoid;
   }
   .timeline > li:last-child {
      padding-bottom: 0;
   }
   .dot {
      position: absolute;
      left: calc(-1.25rem - 5px);
      top: 3px;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid #f5b544;
   }
   .t-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
   }
   .t-title {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 11pt;
      color: #0a0a0b;
   }
   .t-sub {
      color: #c8893a;
      font-size: 9pt;
      font-weight: 500;
      margin-top: 0.05rem;
   }
   .dates {
      font-family: var(--font-mono);
      font-size: 7.5pt;
      color: #8a8a8f;
      white-space: nowrap;
      flex-shrink: 0;
   }
   .desc {
      color: #3a3a3f;
      margin-top: 0.3rem;
      font-size: 9.5pt;
   }
   .tags {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 4px 5px;
      margin-top: 0.45rem;
   }
   .tags li {
      font-family: var(--font-mono);
      font-size: 7pt;
      color: #4a4a4f;
      background: #f6f6f1;
      border: 1px solid #e2e2dc;
      border-radius: 4px;
      padding: 1px 6px;
   }

   /* PROJECTS */
   .proj-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.85rem 1.5rem;
   }
   .proj {
      break-inside: avoid;
      min-width: 0;
   }
   .proj-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.6rem;
      border-left: 2px solid #f5b544;
      padding-left: 0.5rem;
      min-width: 0;
   }
   .proj-name {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 10pt;
      color: #0a0a0b;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
   }
   .proj-url {
      font-family: var(--font-mono);
      font-size: 7pt;
      color: #8a8a8f;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 50%;
      flex-shrink: 0;
   }
   .proj .desc {
      margin-top: 0.25rem;
      padding-left: 0.5rem;
      font-size: 9pt;
   }
   .proj-tech {
      font-family: var(--font-mono);
      font-size: 7pt;
      color: #8a8a8f;
      margin-top: 0.3rem;
      padding-left: 0.5rem;
      line-height: 1.5;
   }

   /* CHIPS */
   .two-col {
      display: grid;
      grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
      gap: 1.5rem;
   }
   .chips {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 4px 5px;
   }
   .chips li {
      font-family: var(--font-mono);
      font-size: 7.5pt;
      color: #1a1a1c;
      background: #f6f6f1;
      border: 1px solid #e2e2dc;
      border-radius: 4px;
      padding: 2px 7px;
   }

   .doc-foot {
      margin-top: 1.75rem;
      padding-top: 0.7rem;
      border-top: 1px solid #e2e2dc;
      font-family: var(--font-mono);
      font-size: 7pt;
      color: #b0b0a8;
      text-align: center;
   }

   @media print {
      @page {
         size: A4;
         margin: 13mm 14mm;
      }
      .backdrop {
         background: #fff;
         padding: 0;
         display: block;
         min-height: 0;
      }
      .no-print {
         display: none !important;
      }
      .sheet {
         max-width: none;
         width: 100%;
         padding: 0;
         box-shadow: none;
         border-radius: 0;
         font-size: 9.5pt;
      }
      .block h2 {
         break-after: avoid;
      }
      .head,
      .photo,
      .eyebrow,
      .num,
      .net,
      .t-sub,
      .dot,
      .tags li,
      .chips li,
      .proj-head {
         -webkit-print-color-adjust: exact;
         print-color-adjust: exact;
      }
   }
</style>
