import type {
  DatabaseApplication,
  DatabaseResume,
  DatabaseStatusEvent,
} from '../db/schema.ts'
import {
  ApplicationResponseSchema,
  type ApplicationResponse,
  StatusEventResponseSchema,
  type StatusEventResponse,
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

export const toStatusEventResponse = (
  event: DatabaseStatusEvent
): StatusEventResponse => {
  const result = StatusEventResponseSchema.safeParse(event)

  if (!result.success) {
    throw new Error(
      `Invalid status event row ${event.id}: ${result.error.message}`
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
