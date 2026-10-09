import { z } from 'zod'

export const LanguageSchema = z.enum(['fi', 'en', 'sv'])
export const LANGUAGES = LanguageSchema.options
export type LanguageId = z.infer<typeof LanguageSchema>

export const ThemeSchema = z.enum(['light', 'dark', 'system'])
export const THEMES = ThemeSchema.options
export type Theme = z.infer<typeof ThemeSchema>

export const NAME_MIN_LENGTH = 2
export const NAME_MAX_LENGTH = 32
export const PASSWORD_MIN_LENGTH = 15
export const PASSWORD_MAX_LENGTH = 64
export const MAX_TEXT_LENGTH = 100
export const MAX_LONG_TEXT_LENGTH = 6000

export const nameField = z
  .string()
  .trim()
  .min(NAME_MIN_LENGTH)
  .max(NAME_MAX_LENGTH)

export const passwordField = z
  .string()
  .min(PASSWORD_MIN_LENGTH)
  .max(PASSWORD_MAX_LENGTH)

export const emptyToNull = (value: string) =>
  value.trim() === '' ? null : value.trim()

export const requiredText = (max: number) => z.string().trim().min(1).max(max)

export const optionalText = (max: number) =>
  z.string().trim().max(max).transform(emptyToNull).nullish()
