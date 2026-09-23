import { z } from 'zod'

export const PublicUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  roles: z.array(z.string()),
  createdAt: z.iso.datetime(),
})

export const NAME_MIN_LENGTH = 4
export const NAME_MAX_LENGTH = 32
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 24

export const NewUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(NAME_MIN_LENGTH, { message: 'validation.name.tooShort' })
    .max(NAME_MAX_LENGTH, { message: 'validation.name.tooLong' }),
  email: z.email({ message: 'validation.email.invalid' }).trim().toLowerCase(),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, { message: 'validation.password.tooShort' })
    .regex(/[a-z]/, { message: 'validation.password.missingLowercase' })
    .regex(/[A-Z]/, { message: 'validation.password.missingUppercase' })
    .regex(/[0-9]/, { message: 'validation.password.missingNumber' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'validation.password.missingSpecialChar',
    })
    .max(PASSWORD_MAX_LENGTH, { message: 'validation.password.tooLong' }),
})

export const UpdateUserProfileSchema = NewUserSchema.pick({
  name: true,
  email: true,
})
  .partial()
  .refine(data => Object.keys(data).length > 0, {
    message: 'validation.updateUserProfile.noFields',
  })

export type UpdateUserProfilePayload = z.infer<typeof UpdateUserProfileSchema>

export const UpdateUserPasswordSchema = z.object({
  password: z.string().min(1, { message: 'validation.password.required' }),
  newPassword: NewUserSchema.shape.password,
})

export type UpdateUserPasswordPayload = z.infer<typeof UpdateUserPasswordSchema>

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'validation.email.required' })
    .trim()
    .toLowerCase(),
  password: z.string().min(1, { message: 'validation.password.required' }),
})

export type PublicUser = z.infer<typeof PublicUserSchema>
export type NewUser = z.infer<typeof NewUserSchema>

export type LoginCredentials = z.infer<typeof LoginSchema>
