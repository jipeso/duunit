import { asc, desc, eq } from 'drizzle-orm'

import { db } from '../db/index.ts'
import {
  applications,
  applicationStatusEvents,
  jobAnalyses,
  resumes,
  sessions,
  users,
} from '../db/schema.ts'
import { AppError } from '../util/AppError.ts'
import {
  toApplicationResponse,
  toResumeResponse,
  toStatusEventResponse,
} from './utils.ts'

const exportData = async (userId: string) => {
  const [user] = await db
    .select({
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))

  if (!user) {
    throw new AppError('NOT_FOUND', 404)
  }

  const userApplications = await db
    .select()
    .from(applications)
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.createdAt))

  const statusEventRows = await db
    .select({ event: applicationStatusEvents })
    .from(applicationStatusEvents)
    .innerJoin(
      applications,
      eq(applicationStatusEvents.applicationId, applications.id)
    )
    .where(eq(applications.userId, userId))
    .orderBy(
      asc(applicationStatusEvents.occurredOn),
      asc(applicationStatusEvents.createdAt)
    )

  const statusEvents = Map.groupBy(
    statusEventRows.map(({ event }) => event),
    event => event.applicationId
  )

  const userResumes = await db
    .select({
      id: resumes.id,
      fileName: resumes.fileName,
      createdAt: resumes.createdAt,
    })
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .orderBy(desc(resumes.createdAt))

  const analyses = await db
    .select({ createdAt: jobAnalyses.createdAt })
    .from(jobAnalyses)
    .where(eq(jobAnalyses.userId, userId))
    .orderBy(desc(jobAnalyses.createdAt))

  const userSessions = await db
    .select({
      ipAddress: sessions.ipAddress,
      userAgent: sessions.userAgent,
      createdAt: sessions.createdAt,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .orderBy(desc(sessions.createdAt))

  return {
    exportedAt: new Date(),
    user,
    applications: userApplications.map(application => ({
      ...toApplicationResponse(application),
      statusEvents: (statusEvents.get(application.id) ?? []).map(
        toStatusEventResponse
      ),
    })),
    resumes: userResumes.map(toResumeResponse),
    jobAnalyses: analyses,
    sessions: userSessions,
  }
}

export default { exportData }
