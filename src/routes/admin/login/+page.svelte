<script lang="ts">
   import { enhance } from '$app/forms'
   import { onMount } from 'svelte'
   import type { ActionData } from './$types'

   let { form }: { form: ActionData } = $props()

   let loading = $state(false)
   let showPass = $state(false)
   let caps = $state(false)
   let cedulaEl = $state<HTMLInputElement | null>(null)

   onMount(() => cedulaEl?.focus())

   const submit = () => {
      loading = true
      return async ({ update }: { update: () => Promise<void> }) => {
         await update()
         loading = false
      }
   }

   function capsCheck(e: KeyboardEvent) {
      caps = e.getModifierState?.('CapsLock') ?? false
   }
</script>

<svelte:head>
   <title>Ingresar · Panel</title>
   <meta name="robots" content="noindex" />
</svelte:head>

<main class="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
   <!-- Panel de marca (oscuro, fijo: la identidad nació sobre negro) -->
   <aside
      class="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex"
      style="background:#0a0a0b;color:#fafaf7"
   >
      <div
         class="pointer-events-none absolute -right-24 -top-24 size-[30rem] rounded-full"
         style="background:radial-gradient(circle,rgba(245,181,68,.28),transparent 70%)"
         aria-hidden="true"
      ></div>
      <div
         class="pointer-events-none absolute -bottom-32 -left-20 size-[26rem] rounded-full"
         style="background:radial-gradient(circle,rgba(77,212,224,.16),transparent 70%)"
         aria-hidden="true"
      ></div>

      <div class="relative flex items-center gap-3">
         <img src="/logo_primary.svg" alt="" class="size-9" />
         <span class="font-mono text-sm tracking-wide" style="color:#8a8a8f">charlsdev</span>
      </div>

      <div class="relative">
         <h1
            class="font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight"
            style="color:#fafaf7"
         >
            Panel de<br />administración
         </h1>
         <p class="mt-4 max-w-sm text-sm leading-relaxed" style="color:#d4d4d0">
            Gestioná el contenido de tu portafolio — experiencia, proyectos, skills —
            y se publica al instante.
         </p>
      </div>

      <p class="relative font-mono text-xs" style="color:#4a4a4f">
         © {new Date().getFullYear()} charlsdev
      </p>
   </aside>

   <!-- Formulario -->
   <section class="flex items-center justify-center bg-bg px-6 py-12">
      <div class="w-full max-w-sm">
         <div class="mb-8 flex items-center gap-3 lg:hidden">
            <img src="/logo_primary.svg" alt="" class="size-9" />
            <span class="font-mono text-sm text-fg-tertiary">charlsdev</span>
         </div>

         <h2 class="font-display text-2xl font-bold text-fg">Ingresar</h2>
         <p class="mt-1.5 mb-7 text-sm text-fg-tertiary">
            Accedé con tu cédula y contraseña.
         </p>

         {#if form?.error}
            <p
               class="mb-5 flex items-center gap-2 rounded-md border border-error/25
                      bg-error-bg px-3 py-2.5 text-sm text-error"
               role="alert"
            >
               <svg
                  class="shrink-0"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
               >
                  <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
               </svg>
               {form.error}
            </p>
         {/if}

         <form method="POST" use:enhance={submit} class="flex flex-col gap-4" novalidate>
            <div class="flex flex-col gap-1.5">
               <label
                  for="cedula"
                  class="text-xs font-semibold uppercase tracking-wider text-fg-tertiary"
               >
                  Cédula
               </label>
               <div class="relative">
                  <svg
                     class="pointer-events-none absolute inset-y-0 left-3 my-auto text-fg-tertiary"
                     width="16"
                     height="16"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="2"
                     stroke-linecap="round"
                  >
                     <rect x="3" y="5" width="18" height="14" rx="2" />
                     <circle cx="9" cy="11" r="2" /><path d="M14 10h4M14 14h4M6.5 16c.6-1.5 4.4-1.5 5 0" />
                  </svg>
                  <input
                     bind:this={cedulaEl}
                     id="cedula"
                     name="cedula"
                     inputmode="numeric"
                     autocomplete="username"
                     required
                     enterkeyhint="next"
                     placeholder="0102030405"
                     class="w-full rounded-md border border-line bg-surface py-2.5 pl-9 pr-3
                            font-mono text-sm text-fg transition placeholder:text-fg-tertiary/60
                            focus:border-primary focus:outline-none focus:ring-3
                            focus:ring-primary/20"
                  />
               </div>
            </div>

            <div class="flex flex-col gap-1.5">
               <label
                  for="password"
                  class="text-xs font-semibold uppercase tracking-wider text-fg-tertiary"
               >
                  Contraseña
               </label>
               <div class="relative">
                  <svg
                     class="pointer-events-none absolute inset-y-0 left-3 my-auto text-fg-tertiary"
                     width="16"
                     height="16"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="2"
                     stroke-linecap="round"
                  >
                     <rect x="4" y="11" width="16" height="10" rx="2" />
                     <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                  <input
                     id="password"
                     name="password"
                     type={showPass ? 'text' : 'password'}
                     autocomplete="current-password"
                     required
                     enterkeyhint="go"
                     onkeyup={capsCheck}
                     onkeydown={capsCheck}
                     class="w-full rounded-md border border-line bg-surface py-2.5 pl-9 pr-10
                            text-sm text-fg transition placeholder:text-fg-tertiary/60
                            focus:border-primary focus:outline-none focus:ring-3
                            focus:ring-primary/20"
                  />
                  <button
                     type="button"
                     onclick={() => (showPass = !showPass)}
                     class="absolute inset-y-0 right-0 grid w-10 place-items-center
                            text-fg-tertiary transition-colors hover:text-primary"
                     aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                     tabindex="-1"
                  >
                     {#if showPass}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2" stroke-linecap="round">
                           <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                           <path d="M9.4 5.2A9 9 0 0121 12a9 9 0 01-1.6 2.6M6.1 6.1A9 9 0 003 12a9 9 0 0011 7" />
                        </svg>
                     {:else}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2" stroke-linecap="round">
                           <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                           <circle cx="12" cy="12" r="3" />
                        </svg>
                     {/if}
                  </button>
               </div>
               {#if caps}
                  <p class="flex items-center gap-1.5 text-xs text-warning" aria-live="polite">
                     <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                        <path d="M12 3l8 8h-5v5H9v-5H4z" />
                     </svg>
                     Bloq Mayús está activado
                  </p>
               {/if}
            </div>

            <button
               type="submit"
               disabled={loading}
               class="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary
                      py-3 font-semibold text-ink transition hover:brightness-95
                      active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
            >
               {#if loading}
                  <svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                     <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3"
                        opacity="0.25" />
                     <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3"
                        stroke-linecap="round" />
                  </svg>
                  Ingresando…
               {:else}
                  Ingresar
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
                     <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
               {/if}
            </button>
         </form>

         <a
            href="/"
            class="mt-6 inline-flex items-center gap-1 font-mono text-xs text-fg-tertiary
                   transition-colors hover:text-primary"
         >
            ← Volver al sitio
         </a>
      </div>
   </section>
</main>
