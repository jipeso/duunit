import { z } from 'zod'

import { nameField, passwordField } from './common.ts'

export const ROLES = ['user', 'admin'] as const
export const RoleSchema = z.enum(ROLES)
export type Role = z.infer<typeof RoleSchema>

export const PublicUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  roles: z.array(RoleSchema),
  createdAt: z.iso.datetime(),
})
export type PublicUser = z.infer<typeof PublicUserSchema>

export const NewUserSchema = z.object({
  name: nameField,
  email: z.email().trim().toLowerCase(),
  password: passwordField,
})
export type NewUser = z.infer<typeof NewUserSchema>

export const UpdateUserProfileSchema = NewUserSchema.pick({
  name: true,
  email: true,
})
  .partial()
  .refine(data => Object.keys(data).length > 0, {
    error: 'validation.updateUserProfile.noFields',
  })
export type UpdateUserProfilePayload = z.infer<typeof UpdateUserProfileSchema>

export const UpdateUserPasswordSchema = z.object({
  password: z.string().min(1),
  newPassword: passwordField,
})
export type UpdateUserPasswordPayload = z.infer<typeof UpdateUserPasswordSchema>

export const LoginSchema = z.object({
  email: z.string().min(1).trim().toLowerCase(),
  password: z.string().min(1),
})
export type LoginCredentials = z.infer<typeof LoginSchema>
