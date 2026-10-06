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

const deleteStatusEvent = async (
  userId: string,
  applicationId: string,
  eventId: string
): Promise<void> => {
  await db.transaction(async tx => {
    const [application] = await tx
      .select({ status: applications.status })
      .from(applications)
      .where(
        and(eq(applications.id, applicationId), eq(applications.userId, userId))
      )
      .for('update')

    if (!application) {
      throw new AppError('APPLICATION_NOT_FOUND', 404)
    }

    const events = await tx
      .select({
        id: applicationStatusEvents.id,
        status: applicationStatusEvents.status,
      })
      .from(applicationStatusEvents)
      .where(eq(applicationStatusEvents.applicationId, applicationId))
      .orderBy(asc(applicationStatusEvents.changedAt))

    if (!events.some(event => event.id === eventId)) {
      throw new AppError('STATUS_EVENT_NOT_FOUND', 404)
    }

    const latestRemaining = events.filter(event => event.id !== eventId).at(-1)

    if (!latestRemaining) {
      throw new AppError('LAST_STATUS_EVENT', 409)
    }

    await tx
      .delete(applicationStatusEvents)
      .where(eq(applicationStatusEvents.id, eventId))

    if (latestRemaining.status !== application.status) {
      await tx
        .update(applications)
        .set({ status: latestRemaining.status })
        .where(eq(applications.id, applicationId))
    }
  })
}

export default {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
  getStatusEvents,
  deleteStatusEvent,
}
