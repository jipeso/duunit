import { eq, and } from 'drizzle-orm'

import { db } from '../db/index.ts'
import { applications } from '../db/schema.ts'
import type {
  ApplicationResponse,
  NewApplication,
  UpdateApplication,
} from '#common/types/applications.ts'
import { AppError } from '../util/AppError.ts'
import { toApplicationResponse } from './utils.ts'

const createApplication = async (
  userId: string,
  application: NewApplication
): Promise<ApplicationResponse> => {
  const [addedApplication] = await db
    .insert(applications)
    .values({ ...application, userId })
    .returning()

  if (!addedApplication) {
    throw new AppError('INTERNAL_ERROR', 500)
  }

  return toApplicationResponse(addedApplication)
}

const getApplicationsByUserId = async (
  userId: string
): Promise<ApplicationResponse[]> => {
  const userApplications = await db.query.applications.findMany({
    where: eq(applications.userId, userId),
  })
  return userApplications.map(toApplicationResponse)
}

const updateApplication = async (
  userId: string,
  applicationId: string,
  application: UpdateApplication
): Promise<ApplicationResponse> => {
  const [updatedApplication] = await db
    .update(applications)
    .set(application)
    .where(
      and(eq(applications.id, applicationId), eq(applications.userId, userId))
    )
    .returning()

  if (!updatedApplication) {
    throw new AppError('APPLICATION_NOT_FOUND', 404)
  }

  return toApplicationResponse(updatedApplication)
}

const deleteApplication = async (
  userId: string,
  applicationId: string
): Promise<void> => {
  const [deletedApplication] = await db
    .delete(applications)
    .where(
      and(eq(applications.id, applicationId), eq(applications.userId, userId))
    )
    .returning({ id: applications.id })

  if (!deletedApplication) {
    throw new AppError('APPLICATION_NOT_FOUND', 404)
  }
}

export default {
  createApplication,
  getApplicationsByUserId,
  updateApplication,
  deleteApplication,
}
