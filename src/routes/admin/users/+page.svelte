<script lang="ts">
   import { enhance } from '$app/forms'
   import { enhanceKeep } from '@/forms'
   import type { ActionData, PageData } from './$types'

   let { data, form }: { data: PageData; form: ActionData } = $props()

   const fmt = (d: string | Date) =>
      new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(new Date(d))
</script>

<svelte:head><title>Admin · Usuarios</title></svelte:head>

<h1 class="admin-h1">Usuarios</h1>
<p class="admin-lead">
   Quién puede entrar al panel. Desactivá una cuenta para revocar el acceso al
   instante (sin borrarla). No podés desactivar ni eliminar tu propia cuenta.
</p>

{#if form?.saved}<p class="flash">Guardado ✓</p>{/if}
{#if form?.error}<p class="flash flash-error">{form.error}</p>{/if}

{#each data.users as u (u.id)}
   <div class="entity" class:opacity-60={!u.isActive}>
      <div class="flex flex-wrap items-start justify-between gap-3">
         <div>
            <p class="font-display text-base font-semibold text-fg">
               {u.fullName}
               {#if u.id === data.meId}
                  <span class="ml-1 align-middle font-mono text-[0.65rem] text-primary-deep
                               dark:text-primary">(vos)</span>
               {/if}
            </p>
            <p class="mt-0.5 font-mono text-xs text-fg-tertiary">
               cédula {u.cedula} · alta {fmt(u.createdAt)}
            </p>
         </div>
         <span
            class="rounded-full px-2.5 py-0.5 text-xs font-medium"
            class:bg-success-bg={u.isActive}
            class:text-success={u.isActive}
            class:bg-error-bg={!u.isActive}
            class:text-error={!u.isActive}
         >
            {u.isActive ? 'Activo' : 'Inactivo'}
         </span>
      </div>

      <div class="actions mt-4 flex-wrap">
         {#if u.id !== data.meId}
            <form method="POST" action="?/setActive" use:enhanceKeep>
               <input type="hidden" name="id" value={u.id} />
               <input type="hidden" name="active" value={(!u.isActive).toString()} />
               <button class="btn-secondary" type="submit">
                  {u.isActive ? 'Desactivar' : 'Activar'}
               </button>
            </form>
         {/if}

         <form
            method="POST"
            action="?/setPassword"
            use:enhanceKeep
            class="flex items-center gap-2"
         >
            <input type="hidden" name="id" value={u.id} />
            <input
               name="password"
               type="password"
               placeholder="Nueva contraseña"
               minlength="6"
               class="rounded-md border border-line bg-bg px-3 py-1.5 text-sm text-fg
                      focus:border-primary focus:outline-none"
            />
            <button class="btn-secondary" type="submit">Cambiar clave</button>
         </form>

         {#if u.id !== data.meId}
            <form method="POST" action="?/delete" use:enhanceKeep>
               <input type="hidden" name="id" value={u.id} />
               <button class="btn-danger" type="submit">Eliminar</button>
            </form>
         {/if}
      </div>
   </div>
{/each}

<form method="POST" action="?/create" use:enhance class="entity new">
   <h3>+ Nuevo usuario</h3>
   <div class="grid-2">
      <div class="field">
         <label for="n-ced">Cédula</label>
         <input id="n-ced" name="cedula" inputmode="numeric" placeholder="0102030405" />
      </div>
      <div class="field">
         <label for="n-fn">Nombres y apellidos</label>
         <input id="n-fn" name="fullName" placeholder="Carlos Villacreses" />
      </div>
   </div>
   <div class="field" style="max-width:50%">
      <label for="n-pw">Contraseña</label>
      <input id="n-pw" name="password" type="password" placeholder="mín. 6 caracteres" />
   </div>
   <div class="actions">
      <button class="btn btn-secondary" type="submit">Crear usuario</button>
   </div>
</form>
