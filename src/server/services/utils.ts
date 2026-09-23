import bcrypt from 'bcrypt'
import _ from 'lodash'

import type { DatabaseUser } from '../types.ts'
import type { PublicUser } from '#common/types/users.ts'

const SALT_ROUNDS = 10

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, SALT_ROUNDS)

export const verifyPassword = (
  password: string,
  passwordHash: string
): Promise<boolean> => bcrypt.compare(password, passwordHash)

export const toPublicUser = (user: DatabaseUser): PublicUser => {
  const { createdAt, ...rest } = _.omit(user, ['passwordHash'])
  return {
    ...rest,
    createdAt: createdAt.toISOString(),
  }
}
