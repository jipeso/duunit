import { eq, and, desc } from 'drizzle-orm'

import { db } from '../db/index.ts'
import { resumes, users, type DatabaseResume } from '../db/schema.ts'
import { AppError } from '../util/AppError.ts'
import { MAX_RESUMES, type ResumeResponse } from '#common/types/resumes.ts'
import { toResumeResponse } from './utils.ts'

const resumeColumns = {
  id: resumes.id,
  fileName: resumes.fileName,
  createdAt: resumes.createdAt,
}

const getResumes = async (userId: string): Promise<ResumeResponse[]> => {
  const rows = await db
    .select(resumeColumns)
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .orderBy(desc(resumes.createdAt))

  return rows.map(toResumeResponse)
}

const getResumeFile = async (
  userId: string,
  resumeId: string
): Promise<Pick<DatabaseResume, 'fileName' | 'data'>> => {
  const [resume] = await db
    .select({ fileName: resumes.fileName, data: resumes.data })
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))

  if (!resume) {
    throw new AppError('RESUME_NOT_FOUND', 404)
  }

  return resume
}

const createResume = async (
  userId: string,
  fileName: string,
  data: Buffer
): Promise<ResumeResponse> => {
  const resume = await db.transaction(async tx => {
    await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .for('update')

    if ((await tx.$count(resumes, eq(resumes.userId, userId))) >= MAX_RESUMES) {
      throw new AppError('RESUME_LIMIT_REACHED', 409)
    }

    const [row] = await tx
      .insert(resumes)
      .values({ userId, fileName, data })
      .returning(resumeColumns)

    if (!row) {
      throw new AppError('INTERNAL_ERROR', 500)
    }

    return row
  })

  return toResumeResponse(resume)
}

const deleteResume = async (
  userId: string,
  resumeId: string
): Promise<void> => {
  const [deletedResume] = await db
    .delete(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
    .returning({ id: resumes.id })

  if (!deletedResume) {
    throw new AppError('RESUME_NOT_FOUND', 404)
  }
}

export default {
  getResumes,
  getResumeFile,
  createResume,
  deleteResume,
}
