import { enhance } from '$app/forms'
import type { SubmitFunction } from '@sveltejs/kit'

// `use:enhance` por defecto resetea el <form> en éxito. En formularios
// pre-cargados (edición) eso deja los inputs en su defaultValue (vacío) y,
// como el valor real no cambió, la reactividad de Svelte no los re-escribe
// → parecía que el contenido "se borraba" hasta refrescar.
// `enhanceKeep` mantiene los valores; igual invalida y aplica el resultado.
const keep: SubmitFunction = () => async ({ update }) => {
   await update({ reset: false })
}

export const enhanceKeep = (node: HTMLFormElement) => enhance(node, keep)
