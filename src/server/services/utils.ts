import bcrypt from 'bcrypt'

import type { DatabaseUser, DatabaseApplication } from '../db/schema.ts'
import { type PublicUser, PublicUserSchema } from '#common/types/users.ts'
import {
  ApplicationResponseSchema,
  type ApplicationResponse,
} from '#common/types/applications.ts'

const SALT_ROUNDS = 10

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, SALT_ROUNDS)

export const verifyPassword = (
  password: string,
  passwordHash: string
): Promise<boolean> => bcrypt.compare(password, passwordHash)

export const toPublicUser = (user: DatabaseUser): PublicUser =>
  PublicUserSchema.parse({ ...user, createdAt: user.createdAt.toISOString() })

export const toApplicationResponse = (
  app: DatabaseApplication
): ApplicationResponse =>
  ApplicationResponseSchema.parse({
    ...app,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  })
