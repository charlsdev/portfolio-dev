// See https://svelte.dev/docs/kit/types#app.d.ts

declare global {
   namespace App {
      interface Locals {
         // true cuando la request trae una sesión válida (usuario activo)
         admin: boolean
         // usuario logueado (o null); sin passwordHash
         user: {
            id: number
            cedula: string
            fullName: string
            isActive: boolean
            createdAt: Date
         } | null
      }
      // interface Error {}
      // interface PageData {}
      // interface PageState {}
      // interface Platform {}
   }
}

export {}
