import { eq, and, asc } from 'drizzle-orm'

import { db } from '../db/index.ts'
import { applications, applicationStatusEvents } from '../db/schema.ts'
import type {
  ApplicationResponse,
  StatusEventResponse,
  NewApplication,
  UpdateApplication,
} from '#common/types/applications.ts'
import { AppError } from '../util/AppError.ts'
import { toApplicationResponse, toStatusEventResponse } from './utils.ts'

const createApplication = async (
  userId: string,
  application: NewApplication
): Promise<ApplicationResponse> => {
  const addedApplication = await db.transaction(async tx => {
    const [row] = await tx
      .insert(applications)
      .values({ ...application, userId })
      .returning()

    if (!row) {
      throw new AppError('INTERNAL_ERROR', 500)
    }

    await tx
      .insert(applicationStatusEvents)
      .values({ applicationId: row.id, status: row.status })

    return row
  })

  return toApplicationResponse(addedApplication)
}

const getApplications = async (
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
  const updatedApplication = await db.transaction(async tx => {
    const [current] = await tx
      .select({ status: applications.status })
      .from(applications)
      .where(
        and(eq(applications.id, applicationId), eq(applications.userId, userId))
      )
      .for('update')

    if (!current) {
      throw new AppError('APPLICATION_NOT_FOUND', 404)
    }

    const [row] = await tx
      .update(applications)
      .set(application)
      .where(eq(applications.id, applicationId))
      .returning()

    if (!row) {
      throw new AppError('INTERNAL_ERROR', 500)
    }

    if (row.status !== current.status) {
      await tx
        .insert(applicationStatusEvents)
        .values({ applicationId: row.id, status: row.status })
    }

    return row
  })

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

const getStatusEvents = async (
  userId: string,
  applicationId: string
): Promise<StatusEventResponse[]> => {
  const [application] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(
      and(eq(applications.id, applicationId), eq(applications.userId, userId))
    )

  if (!application) {
    throw new AppError('APPLICATION_NOT_FOUND', 404)
  }

  const events = await db
    .select()
    .from(applicationStatusEvents)
    .where(eq(applicationStatusEvents.applicationId, applicationId))
    .orderBy(asc(applicationStatusEvents.changedAt))

  return events.map(toStatusEventResponse)
}

export default {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
  getStatusEvents,
}
