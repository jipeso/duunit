import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { APIError } from 'better-auth/api'

import { db } from '../db/index.ts'
import { ROLES } from '#common/types/users.ts'
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '#common/types/common.ts'

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', usePlural: true }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: PASSWORD_MIN_LENGTH,
    maxPasswordLength: PASSWORD_MAX_LENGTH,
  },
  user: {
    additionalFields: {
      role: { type: [...ROLES], input: false, defaultValue: 'user' },
    },
    deleteUser: {
      enabled: true,
      beforeDelete: user => {
        if ('role' in user && user.role === 'admin') {
          throw APIError.from('BAD_REQUEST', {
            code: 'ADMIN_CANNOT_DELETE',
            message: 'Admins cannot delete their account',
          })
        }
        return Promise.resolve()
      },
    },
  },
  advanced: {
    database: { generateId: 'uuid' },
  },
})

export type AuthUser = typeof auth.$Infer.Session.user
