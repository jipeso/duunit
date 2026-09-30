import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from '../db/index.ts'
import { ROLES } from '#common/types/users.ts'

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', usePlural: true }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: [...ROLES], input: false, defaultValue: 'user' },
    },
  },
  advanced: {
    database: { generateId: 'uuid' },
  },
})

export type AuthUser = typeof auth.$Infer.Session.user
