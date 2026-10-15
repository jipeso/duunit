import type { ROLES } from './users.ts'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: (typeof ROLES)[number]
  createdAt: string
  applications: number
  resumes: number
  analyses: number
}
