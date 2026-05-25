// Registro canónico de secciones del portfolio (orden por defecto + qué va en
// modo Dev). La tabla `sections` guarda los overrides editables desde el admin;
// seedSections() inserta las filas faltantes a partir de esto.

export type SectionKey =
   | 'about'
   | 'experience'
   | 'education'
   | 'projects'
   | 'courses'
   | 'talks'
   | 'publications'
   | 'research'
   | 'awards'
   | 'skills'

export type SectionDef = { key: SectionKey; label: string; inDev: boolean }

// El orden de este array = orden por defecto.
export const SECTION_DEFS: SectionDef[] = [
   { key: 'about', label: 'Sobre mí', inDev: true },
   { key: 'experience', label: 'Experiencia', inDev: true },
   { key: 'education', label: 'Estudios', inDev: true },
   { key: 'projects', label: 'Proyectos', inDev: true },
   { key: 'courses', label: 'Cursos y capacitaciones', inDev: false },
   { key: 'talks', label: 'Ponencias', inDev: false },
   { key: 'publications', label: 'Publicaciones', inDev: false },
   { key: 'research', label: 'Investigaciones', inDev: false },
   { key: 'awards', label: 'Méritos y distinciones', inDev: false },
   { key: 'skills', label: 'Habilidades', inDev: true },
]

export type ViewMode = 'dev' | 'completo'
