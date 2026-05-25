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

   const today = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' }).format(
      new Date(),
   )

   const host = (u?: string) => {
      if (!u) return ''
      try {
         return new URL(u).hostname.replace(/^www\./, '')
      } catch {
         return u.replace(/^https?:\/\//, '').split('/')[0]
      }
   }
   const cdate = (s: string | null) => (s ? transformDate(s) : '')
   const crange = (s: string | null, e: string | null) => {
      const a = cdate(s)
      const b2 = cdate(e)
      return a && b2 ? `${a} — ${b2}` : a || b2
   }
   const years = (s: number | null, e: number | null) => {
      if (s != null && e != null) return s === e ? `${s}` : `${s} – ${e}`
      return s != null ? `${s}` : e != null ? `${e}` : ''
   }

   const hasData = (key: string): boolean => {
      switch (key) {
         case 'about':
            return !!b.summary?.trim()
         case 'experience':
            return cv.work.length > 0
         case 'education':
            return cv.education.length > 0
         case 'projects':
            return cv.projects.length > 0
         case 'courses':
            return cv.courses.length > 0
         case 'talks':
            return cv.talks.length > 0
         case 'publications':
            return cv.publications.length > 0
         case 'research':
            return cv.research.length > 0
         case 'awards':
            return cv.awards.length > 0
         case 'skills':
            return cv.skills.length > 0
         default:
            return false
      }
   }

   const visible = $derived(
      data.sections.filter(
         (s) => (data.mode === 'completo' || s.inDev) && hasData(s.key),
      ),
   )
   const pad = (n: number) => String(n).padStart(2, '0')

   onMount(async () => {
      try {
         await document.fonts?.ready
      } catch {}
      setTimeout(() => window.print(), 300)
   })
</script>

<svelte:head>
   <title>CV{data.mode === 'completo' ? ' (completo)' : ''} — {b.name}</title>
   <meta name="robots" content="noindex" />
</svelte:head>

<div class="backdrop">
   <div class="toolbar no-print">
      <a href="/" class="tbtn ghost">← Volver al sitio</a>
      <a href="/cv?mode=dev" class="tbtn ghost" class:active={data.mode === 'dev'}>Dev</a>
      <a href="/cv?mode=completo" class="tbtn ghost" class:active={data.mode === 'completo'}>
         Completo
      </a>
      <button type="button" class="tbtn" onclick={() => window.print()}>Guardar como PDF</button>
   </div>

   <article class="sheet">
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
         {#if b.image}<img class="photo" src={b.image} alt={b.name} />{/if}
      </header>

      {#each visible as s, i (s.key)}
         {@const num = pad(i + 1)}
         {#if s.key === 'about'}{@render secAbout(num)}
         {:else if s.key === 'experience'}{@render secExp(num)}
         {:else if s.key === 'education'}{@render secEdu(num)}
         {:else if s.key === 'projects'}{@render secProj(num)}
         {:else if s.key === 'courses'}{@render secCourses(num)}
         {:else if s.key === 'talks'}{@render secTalks(num)}
         {:else if s.key === 'publications'}{@render secPubs(num)}
         {:else if s.key === 'research'}{@render secResearch(num)}
         {:else if s.key === 'awards'}{@render secAwards(num)}
         {:else if s.key === 'skills'}{@render secSkills(num)}
         {/if}
      {/each}

      {#if cv.languages?.length}{@render secLanguages(pad(visible.length + 1))}{/if}

      <footer class="doc-foot">
         {b.url?.replace(/^https?:\/\//, '') || 'charlsdev'} · Actualizado {today}
      </footer>
   </article>
</div>

{#snippet secAbout(num: string)}
   <section class="block">
      <h2><span class="num">{num}</span> Perfil</h2>
      <p class="summary">{b.summary}</p>
   </section>
{/snippet}

{#snippet secExp(num: string)}
   <section class="block">
      <h2><span class="num">{num}</span> Experiencia</h2>
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
{/snippet}

{#snippet secEdu(num: string)}
   <section class="block">
      <h2><span class="num">{num}</span> Estudios</h2>
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
{/snippet}

{#snippet secProj(num: string)}
   <section class="block">
      <h2><span class="num">{num}</span> Proyectos</h2>
      <div class="proj-grid">
         {#each cv.projects as pr}
            <div class="proj">
               <div class="proj-head">
                  <span class="proj-name">{pr.name}</span>
                  {#if pr.url}<span class="proj-url">{host(pr.url)}</span>{/if}
               </div>
               {#if pr.description}<p class="desc">{pr.description}</p>{/if}
               {#if pr.highlights?.length}
                  <p class="proj-tech">{pr.highlights.join(' · ')}</p>
               {/if}
            </div>
         {/each}
      </div>
   </section>
{/snippet}

{#snippet secCourses(num: string)}
   <section class="block">
      <h2><span class="num">{num}</span> Cursos y capacitaciones</h2>
      <ol class="timeline">
         {#each cv.courses as c}
            <li>
               <span class="dot" aria-hidden="true"></span>
               <div class="t-head">
                  <span class="t-title">{c.title}</span>
                  {#if crange(c.startDate, c.endDate)}
                     <span class="dates">{crange(c.startDate, c.endDate)}</span>
                  {/if}
               </div>
               <p class="t-sub">
                  {[c.institution, c.hours, c.location].filter(Boolean).join(' · ')}
               </p>
            </li>
         {/each}
      </ol>
   </section>
{/snippet}

{#snippet secTalks(num: string)}
   <section class="block">
      <h2><span class="num">{num}</span> Ponencias</h2>
      <ol class="timeline">
         {#each cv.talks as t}
            <li>
               <span class="dot" aria-hidden="true"></span>
               <div class="t-head">
                  <span class="t-title">{t.title}</span>
                  {#if t.dates}<span class="dates">{t.dates}</span>{/if}
               </div>
               <p class="t-sub">
                  {[t.congress, t.institution, t.location].filter(Boolean).join(' · ')}
               </p>
            </li>
         {/each}
      </ol>
   </section>
{/snippet}

{#snippet secPubs(num: string)}
   <section class="block">
      <h2><span class="num">{num}</span> Publicaciones</h2>
      <ol class="timeline">
         {#each cv.publications as p}
            <li>
               <span class="dot" aria-hidden="true"></span>
               <div class="t-head">
                  <span class="t-title">{p.title}</span>
                  {#if p.year}<span class="dates">{p.year}</span>{/if}
               </div>
               <p class="t-sub">
                  {[p.journal, p.coauthors, p.institution].filter(Boolean).join(' · ')}
               </p>
            </li>
         {/each}
      </ol>
   </section>
{/snippet}

{#snippet secResearch(num: string)}
   <section class="block">
      <h2><span class="num">{num}</span> Investigaciones</h2>
      <ol class="timeline">
         {#each cv.research as r}
            <li>
               <span class="dot" aria-hidden="true"></span>
               <div class="t-head">
                  <span class="t-title">{r.title}</span>
                  {#if years(r.startYear, r.endYear)}
                     <span class="dates">{years(r.startYear, r.endYear)}</span>
                  {/if}
               </div>
               <p class="t-sub">{[r.authors, r.institution].filter(Boolean).join(' · ')}</p>
            </li>
         {/each}
      </ol>
   </section>
{/snippet}

{#snippet secAwards(num: string)}
   <section class="block">
      <h2><span class="num">{num}</span> Méritos y distinciones</h2>
      <ol class="timeline">
         {#each cv.awards as a}
            <li>
               <span class="dot" aria-hidden="true"></span>
               <div class="t-head">
                  <span class="t-title">{a.title}</span>
                  {#if years(a.startYear, a.endYear)}
                     <span class="dates">{years(a.startYear, a.endYear)}</span>
                  {/if}
               </div>
               {#if a.institution}<p class="t-sub">{a.institution}</p>{/if}
            </li>
         {/each}
      </ol>
   </section>
{/snippet}

{#snippet secSkills(num: string)}
   <section class="block">
      <h2><span class="num">{num}</span> Habilidades</h2>
      <ul class="chips">
         {#each cv.skills as s}<li>{s.description || s.name}</li>{/each}
      </ul>
   </section>
{/snippet}

{#snippet secLanguages(num: string)}
   <section class="block">
      <h2><span class="num">{num}</span> Idiomas</h2>
      <ul class="chips">
         {#each cv.languages as l}<li>{l.language} · {l.fluency}</li>{/each}
      </ul>
   </section>
{/snippet}

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
   .tbtn.ghost.active {
      border-color: #f5b544;
      color: #c8893a;
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
      width: 84px;
      aspect-ratio: 3 / 4;
      object-fit: cover;
      object-position: top;
      border-radius: 8px;
      flex-shrink: 0;
   }

   /* La sección puede continuar en la página siguiente (evita huecos al pie).
      Los ítems individuales sí se mantienen enteros (.timeline > li / .proj). */
   .block {
      margin-bottom: 1.5rem;
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
