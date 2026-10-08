import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  date,
  boolean,
  index,
  customType,
} from 'drizzle-orm/pg-core'

import { ROLES } from '#common/types/users.ts'
import { APPLICATION_STATUSES } from '#common/types/applications.ts'

// drizzle-orm 0.x has no built-in type for bytea (added in v1)
const bytea = customType<{ data: Buffer }>({ dataType: () => 'bytea' })

export const roleEnum = pgEnum('role', ROLES)
export const applicationStatusEnum = pgEnum(
  'application_status',
  APPLICATION_STATUSES
)

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  role: roleEnum('role').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verifications = pgTable('verifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const resumes = pgTable(
  'resumes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    fileName: text('file_name').notNull(),
    data: bytea('data').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  table => [index('resumes_user_id_idx').on(table.userId)]
)

export const applications = pgTable('applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  company: text('company').notNull(),
  position: text('position').notNull(),
  jobPostingUrl: text('job_posting_url'),
  location: text('location'),
  status: applicationStatusEnum('status').notNull().default('applied'),
  appliedAt: date('applied_at', { mode: 'string' }),
  deadline: date('deadline', { mode: 'string' }),
  nextInterviewAt: timestamp('next_interview_at', {
    withTimezone: true,
    mode: 'string',
  }),
  salary: text('salary'),
  coverLetter: text('cover_letter'),
  notes: text('notes'),
  resumeId: uuid('resume_id').references(() => resumes.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const applicationStatusEvents = pgTable(
  'application_status_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    status: applicationStatusEnum('status').notNull(),
    occurredOn: date('occurred_on', { mode: 'string' }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => [
    index('application_status_events_application_id_idx').on(
      table.applicationId
    ),
  ]
)

export type DatabaseStatusEvent = typeof applicationStatusEvents.$inferSelect
export type DatabaseApplication = typeof applications.$inferSelect
export type DatabaseResume = typeof resumes.$inferSelect
