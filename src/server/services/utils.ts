import type { DatabaseApplication, DatabaseStatusEvent } from '../db/schema.ts'
import {
  ApplicationResponseSchema,
  type ApplicationResponse,
  StatusEventResponseSchema,
  type StatusEventResponse,
} from '#common/types/applications.ts'

export const toApplicationResponse = (
  app: DatabaseApplication
): ApplicationResponse => {
  const result = ApplicationResponseSchema.safeParse({
    ...app,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
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
