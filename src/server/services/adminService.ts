import { desc, eq } from 'drizzle-orm'

import { db } from '../db/index.ts'
import { applications, jobAnalyses, resumes, users } from '../db/schema.ts'
import type { AdminUser } from '#common/types/admin.ts'

const getUsers = async (): Promise<AdminUser[]> => {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      applications: db.$count(applications, eq(applications.userId, users.id)),
      resumes: db.$count(resumes, eq(resumes.userId, users.id)),
      analyses: db.$count(jobAnalyses, eq(jobAnalyses.userId, users.id)),
    })
    .from(users)
    .orderBy(desc(users.createdAt))

  return rows.map(row => ({ ...row, createdAt: row.createdAt.toISOString() }))
}

export default { getUsers }
