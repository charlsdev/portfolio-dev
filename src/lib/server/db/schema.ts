import { boolean, date, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

// Modelo relacional del CV (subconjunto JSON Resume que el sitio renderiza).
// `sort_order` preserva el orden editable desde el admin.
// Las fechas de CV son fechas de calendario, no instantes → tipo `date`.

// Usuarios del panel admin. Login por cédula; password con scrypt.
// is_active permite revocar acceso sin borrar.
export const users = pgTable('users', {
   id: serial('id').primaryKey(),
   cedula: text('cedula').notNull().unique(),
   fullName: text('full_name').notNull().default(''),
   passwordHash: text('password_hash').notNull(),
   isActive: boolean('is_active').notNull().default(true),
   createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Singleton: siempre se usa la fila id = 1.
export const basics = pgTable('basics', {
   id: serial('id').primaryKey(),
   name: text('name').notNull(),
   label: text('label').notNull().default(''),
   image: text('image').notNull().default(''),
   email: text('email').notNull().default(''),
   phone: text('phone').notNull().default(''),
   url: text('url').notNull().default(''),
   summary: text('summary').notNull().default(''),
   address: text('address').notNull().default(''),
   postalCode: text('postal_code').notNull().default(''),
   city: text('city').notNull().default(''),
   countryCode: text('country_code').notNull().default(''),
   region: text('region').notNull().default(''),
   updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const profiles = pgTable('profiles', {
   id: serial('id').primaryKey(),
   network: text('network').notNull(),
   username: text('username').notNull().default(''),
   url: text('url').notNull().default(''),
   sortOrder: integer('sort_order').notNull().default(0),
})

export const work = pgTable('work', {
   id: serial('id').primaryKey(),
   name: text('name').notNull(),
   position: text('position').notNull().default(''),
   url: text('url'),
   startDate: date('start_date'),
   endDate: date('end_date'),
   summary: text('summary').notNull().default(''),
   sortOrder: integer('sort_order').notNull().default(0),
})

export const workHighlights = pgTable('work_highlights', {
   id: serial('id').primaryKey(),
   workId: integer('work_id')
      .notNull()
      .references(() => work.id, { onDelete: 'cascade' }),
   text: text('text').notNull(),
   sortOrder: integer('sort_order').notNull().default(0),
})

export const education = pgTable('education', {
   id: serial('id').primaryKey(),
   institution: text('institution').notNull(),
   url: text('url'),
   area: text('area').notNull().default(''),
   studyType: text('study_type').notNull().default(''),
   startDate: date('start_date'),
   endDate: date('end_date'),
   score: text('score').notNull().default(''),
   sortOrder: integer('sort_order').notNull().default(0),
})

export const projects = pgTable('projects', {
   id: serial('id').primaryKey(),
   name: text('name').notNull(),
   isActive: boolean('is_active').notNull().default(false),
   description: text('description').notNull().default(''),
   url: text('url').notNull().default(''),
   github: text('github'),
   sortOrder: integer('sort_order').notNull().default(0),
})

export const projectHighlights = pgTable('project_highlights', {
   id: serial('id').primaryKey(),
   projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
   text: text('text').notNull(),
   sortOrder: integer('sort_order').notNull().default(0),
})

export const skills = pgTable('skills', {
   id: serial('id').primaryKey(),
   name: text('name').notNull(),
   description: text('description').notNull().default(''),
   sortOrder: integer('sort_order').notNull().default(0),
})

export const languages = pgTable('languages', {
   id: serial('id').primaryKey(),
   language: text('language').notNull(),
   fluency: text('fluency').notNull().default(''),
   sortOrder: integer('sort_order').notNull().default(0),
})
