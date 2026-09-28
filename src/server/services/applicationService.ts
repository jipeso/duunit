import { eq } from 'drizzle-orm'

import { db } from '../db/index.ts'
import { applications } from '../db/schema.ts'
import type {
  ApplicationResponse,
  NewApplication,
} from '#common/types/applications.ts'
import { AppError } from '../util/AppError.ts'
import { toApplicationResponse } from './utils.ts'

const getApplications = async (): Promise<ApplicationResponse[]> => {
  const allApplications = await db.query.applications.findMany()
  return allApplications.map(toApplicationResponse)
}

const createApplication = async (
  userId: string,
  application: NewApplication
): Promise<ApplicationResponse> => {
  const [addedApplication] = await db
    .insert(applications)
    .values({ ...application, userId })
    .returning()

  if (!addedApplication) {
    throw new AppError('Failed to create application', 500)
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

export default {
  getApplications,
  createApplication,
  getApplicationsByUserId,
}
