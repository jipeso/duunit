import { eq, and, desc } from 'drizzle-orm'

import { db, type Transaction } from '../db/index.ts'
import {
  applications,
  resumes,
  type DatabaseApplication,
} from '../db/schema.ts'
import {
  STATUS_DATE_FIELD,
  STATUS_DATE_FIELDS,
  statusRank,
  type ApplicationResponse,
  type NewApplication,
  type StatusDateField,
  type UpdateApplication,
} from '#common/types/applications.ts'
import { AppError } from '../util/AppError.ts'
import { toApplicationResponse } from './utils.ts'

type StatusFields = Pick<DatabaseApplication, 'status' | StatusDateField>

const NEW_APPLICATION: StatusFields = {
  status: 'saved',
  appliedOn: null,
  interviewingOn: null,
  offerOn: null,
  closedOn: null,
}

const resolveStatusFields = (
  current: StatusFields,
  input: UpdateApplication,
  today: string
) => {
  const requested = input.status ?? current.status
  const status =
    input.nextInterviewAt && statusRank(requested) < statusRank('interviewing')
      ? 'interviewing'
      : requested

  const field = STATUS_DATE_FIELD[status]

  const dateFor = (dateField: StatusDateField) =>
    STATUS_DATE_FIELDS.indexOf(dateField) < statusRank(status)
      ? (input[dateField] ?? current[dateField])
      : null

  const result = {
    status,
    appliedOn: dateFor('appliedOn'),
    interviewingOn: dateFor('interviewingOn'),
    offerOn: dateFor('offerOn'),
    closedOn: dateFor('closedOn'),
    ...(status !== 'interviewing' && { nextInterviewAt: null }),
  }

  if (field) {
    result[field] ??= today
    if (status !== 'withdrawn') {
      result.appliedOn ??= today
    }
  }

  const dates = [
    ...STATUS_DATE_FIELDS.flatMap(dateField => result[dateField] ?? []),
    today,
  ]
  if (dates.join() !== dates.toSorted().join()) {
    throw new AppError('VALIDATION_ERROR', 400, 'Status dates are out of order')
  }

  return result
}

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
  application: NewApplication,
  today: string
): Promise<ApplicationResponse> => {
  const addedApplication = await db.transaction(async tx => {
    await checkResumeOwner(tx, userId, application.resumeId)

    const [row] = await tx
      .insert(applications)
      .values({
        ...application,
        ...resolveStatusFields(NEW_APPLICATION, application, today),
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
  application: UpdateApplication,
  today: string
): Promise<ApplicationResponse> => {
  const updatedApplication = await db.transaction(async tx => {
    const [current] = await tx
      .select()
      .from(applications)
      .where(
        and(eq(applications.id, applicationId), eq(applications.userId, userId))
      )
      .for('update')

    if (!current) {
      throw new AppError('APPLICATION_NOT_FOUND', 404)
    }

    await checkResumeOwner(tx, userId, application.resumeId)

    const [row] = await tx
      .update(applications)
      .set({
        ...application,
        ...resolveStatusFields(current, application, today),
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
