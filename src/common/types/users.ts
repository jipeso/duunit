import { z } from 'zod'

import { nameField, passwordField } from './common.ts'

export const ROLES = ['user', 'admin'] as const

export const NewUserSchema = z.object({
  name: nameField,
  email: z.email().trim().toLowerCase(),
  password: passwordField,
})
export type NewUser = z.infer<typeof NewUserSchema>

export const LoginSchema = z.object({
  email: z.string().min(1).pipe(z.email().trim().toLowerCase()),
  password: z.string().min(1),
})
export type LoginCredentials = z.infer<typeof LoginSchema>
