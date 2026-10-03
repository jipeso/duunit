import { z } from 'zod'

export const NAME_MIN_LENGTH = 2
export const NAME_MAX_LENGTH = 32
export const PASSWORD_MIN_LENGTH = 15
export const PASSWORD_MAX_LENGTH = 64

export const nameField = z
  .string()
  .trim()
  .min(NAME_MIN_LENGTH)
  .max(NAME_MAX_LENGTH)

export const passwordField = z
  .string()
  .min(PASSWORD_MIN_LENGTH)
  .max(PASSWORD_MAX_LENGTH)

export const ROLES = ['user', 'admin'] as const

export const NewUserSchema = z.object({
  name: nameField,
  email: z.email().trim().toLowerCase(),
  password: passwordField,
})

export const LoginSchema = z.object({
  email: z.string().min(1).pipe(z.email().trim().toLowerCase()),
  password: z.string().min(1),
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordField,
})

export type NewUser = z.infer<typeof NewUserSchema>
export type LoginCredentials = z.infer<typeof LoginSchema>
export type ChangePassword = z.infer<typeof ChangePasswordSchema>
