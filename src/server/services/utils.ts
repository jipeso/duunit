import type { DatabaseApplication } from '../db/schema.ts'
import {
  ApplicationResponseSchema,
  type ApplicationResponse,
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
    throw new Error(`Invalid application row ${app.id}: ${result.error.message}`)
  }

  return result.data
}
