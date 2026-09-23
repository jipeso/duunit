import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { and, eq, gt } from 'drizzle-orm'

import { db, sessions, users } from '../db/index.ts'
import type { DatabaseUser } from '../types.ts'
import { JWT_SECRET } from '../util/config.ts'
import { AppError } from '../util/AppError.ts'
import type { LoginCredentials } from '#common/types/users.ts'
import { verifyPassword } from './utils.ts'

export const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000

const hashRefreshToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex')

const createRefreshToken = (): string => crypto.randomBytes(32).toString('hex')

const createAccessToken = (user: DatabaseUser): string =>
  jwt.sign({ id: user.id, roles: user.roles }, JWT_SECRET, {
    expiresIn: '15m',
  })

const createSession = async (
  user: DatabaseUser
): Promise<{ accessToken: string; refreshToken: string }> => {
  const refreshToken = createRefreshToken()

  await db.insert(sessions).values({
    userId: user.id,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
  })

  return {
    accessToken: createAccessToken(user),
    refreshToken,
  }
}

const login = async (
  credentials: LoginCredentials
): Promise<{
  user: DatabaseUser
  accessToken: string
  refreshToken: string
}> => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, credentials.email),
  })

  if (
    !user ||
    !(await verifyPassword(credentials.password, user.passwordHash))
  ) {
    throw new AppError('invalid credentials', 401)
  }

  const session = await createSession(user)

  return { user, ...session }
}

const refresh = async (
  refreshToken: string
): Promise<{
  user: DatabaseUser
  accessToken: string
  refreshToken: string
}> => {
  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.refreshTokenHash, hashRefreshToken(refreshToken)),
        gt(sessions.expiresAt, new Date())
      )
    )

  if (!session) {
    throw new AppError('invalid refresh token', 401)
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  })

  if (!user) {
    throw new AppError('user not found', 404)
  }

  const rotatedRefreshToken = createRefreshToken()
  await db
    .update(sessions)
    .set({
      refreshTokenHash: hashRefreshToken(rotatedRefreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
    })
    .where(eq(sessions.id, session.id))

  return {
    user,
    accessToken: createAccessToken(user),
    refreshToken: rotatedRefreshToken,
  }
}

const logout = async (refreshToken?: string): Promise<void> => {
  if (!refreshToken) {
    return
  }

  await db
    .delete(sessions)
    .where(eq(sessions.refreshTokenHash, hashRefreshToken(refreshToken)))
}

export default {
  login,
  refresh,
  logout,
}
