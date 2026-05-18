<script lang="ts">
   import { enhance } from '$app/forms'
   import type { ActionData } from './$types'

   let { form }: { form: ActionData } = $props()

   let loading = $state(false)
   let showPass = $state(false)

   const submit = () => {
      loading = true
      return async ({ update }: { update: () => Promise<void> }) => {
         await update()
         loading = false
      }
   }
</script>

<svelte:head>
   <title>Ingresar · Panel</title>
   <meta name="robots" content="noindex" />
</svelte:head>

<main class="relative grid min-h-dvh place-items-center overflow-hidden bg-bg px-4">
   <div
      class="pointer-events-none absolute -top-40 left-1/2 size-[34rem] -translate-x-1/2
             rounded-full bg-primary/15 blur-[120px]"
      aria-hidden="true"
   ></div>

   <div class="relative w-full max-w-sm">
      <form
         method="POST"
         use:enhance={submit}
         class="overflow-hidden rounded-xl border border-line bg-surface shadow-lg"
      >
         <div class="h-1 w-full bg-primary"></div>

         <div class="p-8">
            <div class="mb-7 flex flex-col items-center gap-3 text-center">
               <img src="/logo_primary.svg" alt="charlsdev" class="size-12" />
               <div>
                  <h1 class="font-display text-xl font-bold text-fg">charlsdev</h1>
                  <p class="mt-1 text-sm text-fg-tertiary">Panel de administración</p>
               </div>
            </div>

            {#if form?.error}
               <p
                  class="mb-5 flex items-center gap-2 rounded-md border border-error/25
                         bg-error-bg px-3 py-2 text-sm text-error"
                  role="alert"
               >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                     <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
                  </svg>
                  {form.error}
               </p>
            {/if}

            <div class="flex flex-col gap-4">
               <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
                     Cédula
                  </span>
                  <input
                     name="cedula"
                     inputmode="numeric"
                     autocomplete="username"
                     required
                     enterkeyhint="next"
                     class="rounded-md border border-line bg-bg px-3 py-2.5 font-mono text-sm
                            text-fg transition focus:border-primary focus:outline-none
                            focus:ring-3 focus:ring-primary/25"
                  />
               </label>

               <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
                     Contraseña
                  </span>
                  <div class="relative">
                     <input
                        name="password"
                        type={showPass ? 'text' : 'password'}
                        autocomplete="current-password"
                        required
                        enterkeyhint="go"
                        class="w-full rounded-md border border-line bg-bg px-3 py-2.5 pr-10
                               text-sm text-fg transition focus:border-primary
                               focus:outline-none focus:ring-3 focus:ring-primary/25"
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
               </label>

               <button
                  type="submit"
                  disabled={loading}
                  class="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary
                         py-2.5 font-semibold text-ink transition hover:brightness-95
                         active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
               >
                  {#if loading}
                     <svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.25" />
                        <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                     </svg>
                     Ingresando…
                  {:else}
                     Ingresar
                  {/if}
               </button>
            </div>
         </div>
      </form>

      <a
         href="/"
         class="mt-5 block text-center font-mono text-xs text-fg-tertiary
                transition-colors hover:text-primary"
      >
         ← Volver al sitio
      </a>
   </div>
</main>
