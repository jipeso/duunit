import { z } from 'zod'

export const LanguageSchema = z.enum(['fi', 'en', 'sv'])
export const LANGUAGES = LanguageSchema.options
export type LanguageId = z.infer<typeof LanguageSchema>

export const ThemeSchema = z.enum(['light', 'dark', 'system'])
export const THEMES = ThemeSchema.options
export type Theme = z.infer<typeof ThemeSchema>
