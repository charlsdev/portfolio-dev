export interface Root {
   basics: Basics
   work: Work[]
   education: Education[]
   projects: Project[]
   skills: Skill[]
   languages: Language[]
   courses: Course[]
   talks: Talk[]
   publications: Publication[]
   research: Research[]
   awards: Award[]
}

export interface Basics {
   name: string
   label: string
   image: string
   email: string
   phone: string
   url: string
   summary: string
   location: Location
   profiles: Profile[]
}

export interface Location {
   address: string
   postalCode: string
   city: string
   countryCode: string
   region: string
}

export interface Profile {
   network: string
   username: string
   url: string
}

export interface Work {
   name: string
   position: string
   url?: string
   startDate: string
   endDate?: string
   summary: string
   highlights: string[]
}

export interface Education {
   institution: string
   url: string
   area: string
   studyType: string
   startDate: string
   endDate: string
   score: string
   courses: string[]
}

export interface Skill {
   name: string
   description: string
}

export interface Language {
   language: string
   fluency: string
}

export interface Project {
   name: string
   isActive?: boolean
   description: string
   highlights: string[]
   url: string
   github?: string
}

/* ---- Secciones académicas ---- */

export interface Course {
   title: string
   institution: string
   hours: string
   location: string
   startDate: string | null
   endDate: string | null
}

export interface Talk {
   title: string
   institution: string
   congress: string
   location: string
   dates: string
}

export interface Publication {
   title: string
   institution: string
   coauthors: string
   journal: string
   year: number | null
}

export interface Award {
   title: string
   institution: string
   startYear: number | null
   endYear: number | null
}

export interface Research {
   title: string
   institution: string
   authors: string
   startYear: number | null
   endYear: number | null
}
