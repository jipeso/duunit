import type { DatabaseApplication, DatabaseResume } from '../db/schema.ts'
import {
  ApplicationResponseSchema,
  type ApplicationResponse,
} from '#common/types/applications.ts'
import {
  ResumeResponseSchema,
  type ResumeResponse,
} from '#common/types/resumes.ts'

export const toApplicationResponse = (
  app: DatabaseApplication
): ApplicationResponse => {
  const result = ApplicationResponseSchema.safeParse({
    ...app,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    nextInterviewAt:
      app.nextInterviewAt && new Date(app.nextInterviewAt).toISOString(),
  })

  if (!result.success) {
    throw new Error(
      `Invalid application row ${app.id}: ${result.error.message}`
    )
  }

  return result.data
}

export const toResumeResponse = (
  resume: Omit<DatabaseResume, 'userId' | 'data'>
): ResumeResponse => {
  const result = ResumeResponseSchema.safeParse({
    ...resume,
    createdAt: resume.createdAt.toISOString(),
  })

  if (!result.success) {
    throw new Error(`Invalid resume row ${resume.id}: ${result.error.message}`)
  }

  return result.data
}
