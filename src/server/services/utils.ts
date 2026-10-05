import type { DatabaseApplication } from '../db/schema.ts'
import {
  ApplicationResponseSchema,
  type ApplicationResponse,
} from '#common/types/applications.ts'
import { AppError } from '../util/AppError.ts'
import { logger } from '../util/logger.ts'

export const toApplicationResponse = (
  app: DatabaseApplication
): ApplicationResponse => {
  const result = ApplicationResponseSchema.safeParse({
    ...app,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  })

  if (!result.success) {
    logger.error(`Invalid application row ${app.id}: ${result.error.message}`)
    throw new AppError('internal server error', 500)
  }

  return result.data
}
