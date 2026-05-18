import { getContext, setContext } from 'svelte'
import type { Root } from '@/cv'

const CV_KEY = Symbol('cv')

// El CV se inyecta una vez en +page.svelte (datos del load SSR) y cada
// sección lo lee con getCv(). Es seguro para SSR: el contexto es por-request,
// no un módulo compartido entre peticiones.
export const setCv = (cv: Root) => setContext(CV_KEY, cv)

export const getCv = (): Root => getContext(CV_KEY)
