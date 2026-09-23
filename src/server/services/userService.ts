import { eq } from 'drizzle-orm'

import { db, users } from '../db/index.ts'
import type {
  PublicUser,
  NewUser,
  UpdateUserProfilePayload,
  UpdateUserPasswordPayload,
} from '#common/types/users.ts'
import { AppError } from '../util/AppError.ts'
import { hashPassword, verifyPassword, toPublicUser } from './utils.ts'

const getUsers = async (): Promise<PublicUser[]> => {
  const allUsers = await db.query.users.findMany()

  return allUsers.map(toPublicUser)
}

const createUser = async ({
  name,
  email,
  password,
}: NewUser): Promise<PublicUser> => {
  const passwordHash = await hashPassword(password)
  const normalizedEmail = email.trim().toLowerCase()
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, normalizedEmail),
  })

  if (existingUser) {
    throw new AppError('email already in use', 409)
  }

  const [addedUser] = await db
    .insert(users)
    .values({
      name,
      email: normalizedEmail,
      passwordHash,
    })
    .returning()

  if (!addedUser) {
    throw new AppError('Failed to create user', 500)
  }

  return toPublicUser(addedUser)
}

const updateUserProfile = async (
  id: string,
  payload: UpdateUserProfilePayload
): Promise<PublicUser> => {
  const updateData: Partial<typeof users.$inferInsert> = {}

  if (payload.name !== undefined) {
    updateData.name = payload.name
  }

  if (payload.email !== undefined) {
    updateData.email = payload.email.trim().toLowerCase()
  }

  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning()

  if (!updatedUser) {
    throw new AppError('Failed to update user profile', 500)
  }

  return toPublicUser(updatedUser)
}

const updateUserPassword = async (
  id: string,
  payload: UpdateUserPasswordPayload
): Promise<void> => {
  const [user] = await db.select().from(users).where(eq(users.id, id))

  if (!user) {
    throw new AppError('User not found', 404)
  }

  const isValidPassword = await verifyPassword(
    payload.password,
    user.passwordHash
  )

  if (!isValidPassword) {
    throw new AppError('Invalid current password', 400)
  }

  const newPasswordHash = await hashPassword(payload.newPassword)

  await db
    .update(users)
    .set({
      passwordHash: newPasswordHash,
    })
    .where(eq(users.id, id))
}

export default {
  getUsers,
  createUser,
  updateUserProfile,
  updateUserPassword,
}
