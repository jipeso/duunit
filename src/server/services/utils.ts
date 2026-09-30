import type { DatabaseApplication } from '../db/schema.ts'
import {
  ApplicationResponseSchema,
  type ApplicationResponse,
} from '#common/types/applications.ts'

export const toApplicationResponse = (
  app: DatabaseApplication
): ApplicationResponse =>
  ApplicationResponseSchema.parse({
    ...app,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  })
