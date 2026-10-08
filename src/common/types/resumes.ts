import { z } from 'zod'

export const MAX_RESUMES = 50
export const MAX_RESUME_BYTES = 2 * 1024 * 1024
const MAX_FILE_NAME_LENGTH = 255

export const ResumeFileNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(MAX_FILE_NAME_LENGTH)

export const ResumeResponseSchema = z.object({
  id: z.uuid(),
  fileName: z.string(),
  createdAt: z.iso.datetime(),
})

export type ResumeResponse = z.infer<typeof ResumeResponseSchema>
