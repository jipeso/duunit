import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  date,
} from 'drizzle-orm/pg-core'

import { ROLES } from '#common/types/users.ts'
import { APPLICATION_STATUSES } from '#common/types/applications.ts'

export const roleEnum = pgEnum('role', ROLES)
export const applicationStatusEnum = pgEnum(
  'application_status',
  APPLICATION_STATUSES
)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  roles: roleEnum('roles').array().notNull().default(['user']),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  refreshTokenHash: text('refresh_token_hash').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
})

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
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type DatabaseUser = typeof users.$inferSelect
export type DatabaseApplication = typeof applications.$inferSelect
