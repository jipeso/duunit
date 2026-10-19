import { eq, and, desc } from 'drizzle-orm'

import { db, type Transaction } from '../db/index.ts'
import {
  applications,
  resumes,
  type DatabaseApplication,
} from '../db/schema.ts'
import {
  STATUS_DATE_FIELD,
  STATUS_DATE_FIELDS as DATE_FIELDS,
  type ApplicationResponse,
  type ApplicationStatus,
  type NewApplication,
  type UpdateApplication,
} from '#common/types/applications.ts'
import { AppError } from '../util/AppError.ts'
import { toApplicationResponse } from './utils.ts'

const syncStatusFields = (
  fields: Pick<DatabaseApplication, 'status' | (typeof DATE_FIELDS)[number]>
) => {
  const field = STATUS_DATE_FIELD[fields.status]
  const result = { ...fields }

  for (const later of DATE_FIELDS.slice(
    field ? DATE_FIELDS.indexOf(field) + 1 : 0
  )) {
    result[later] = null
  }

  if (field) {
    const today = new Date().toISOString().slice(0, 10)
    const latest = DATE_FIELDS.flatMap(f => result[f] ?? [])
      .toSorted()
      .at(-1)
    result[field] ??= latest && latest > today ? latest : today
    result.appliedOn ??= result[field]
  }

  const dates = DATE_FIELDS.flatMap(f => result[f] ?? [])
  if (dates.join() !== dates.toSorted().join()) {
    throw new AppError('VALIDATION_ERROR', 400, 'Status dates are out of order')
  }

  return result
}

const clearInterviewIfClosed = (status: ApplicationStatus) =>
  STATUS_DATE_FIELD[status] === 'closedOn' ? { nextInterviewAt: null } : {}

const checkResumeOwner = async (
  tx: Transaction,
  userId: string,
  resumeId: string | null | undefined
): Promise<void> => {
  if (!resumeId) return

  const [resume] = await tx
    .select({ id: resumes.id })
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))

  if (!resume) {
    throw new AppError('RESUME_NOT_FOUND', 404)
  }
}

const createApplication = async (
  userId: string,
  application: NewApplication
): Promise<ApplicationResponse> => {
  const statusFields = syncStatusFields({
    status: application.status,
    appliedOn: application.appliedOn ?? null,
    interviewingOn: null,
    offerOn: null,
    closedOn: null,
  })

  const addedApplication = await db.transaction(async tx => {
    await checkResumeOwner(tx, userId, application.resumeId)

    const [row] = await tx
      .insert(applications)
      .values({
        ...application,
        ...statusFields,
        ...clearInterviewIfClosed(statusFields.status),
        userId,
      })
      .returning()

    if (!row) {
      throw new AppError('INTERNAL_ERROR', 500)
    }

    return row
  })

  return toApplicationResponse(addedApplication)
}

const getApplications = async (
  userId: string
): Promise<ApplicationResponse[]> => {
  const userApplications = await db.query.applications.findMany({
    where: eq(applications.userId, userId),
    orderBy: desc(applications.createdAt),
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
      .select({
        status: applications.status,
        appliedOn: applications.appliedOn,
        interviewingOn: applications.interviewingOn,
        offerOn: applications.offerOn,
        closedOn: applications.closedOn,
      })
      .from(applications)
      .where(
        and(eq(applications.id, applicationId), eq(applications.userId, userId))
      )
      .for('update')

    if (!current) {
      throw new AppError('APPLICATION_NOT_FOUND', 404)
    }

    await checkResumeOwner(tx, userId, application.resumeId)

    const statusFields = syncStatusFields({
      status: application.status ?? current.status,
      appliedOn: application.appliedOn ?? current.appliedOn,
      interviewingOn: application.interviewingOn ?? current.interviewingOn,
      offerOn: application.offerOn ?? current.offerOn,
      closedOn: application.closedOn ?? current.closedOn,
    })

    const [row] = await tx
      .update(applications)
      .set({
        ...application,
        ...statusFields,
        ...clearInterviewIfClosed(statusFields.status),
      })
      .where(eq(applications.id, applicationId))
      .returning()

    if (!row) {
      throw new AppError('INTERNAL_ERROR', 500)
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

export default {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
}
