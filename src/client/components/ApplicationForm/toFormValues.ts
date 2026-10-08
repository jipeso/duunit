import type {
  ApplicationResponse,
  NewApplicationInput,
} from '#common/types/applications.ts'
import { toDateTimeLocal } from '../../util/date'

export const toFormValues = (
  application: ApplicationResponse
): NewApplicationInput => ({
  company: application.company,
  position: application.position,
  status: application.status,
  jobPostingUrl: application.jobPostingUrl ?? '',
  location: application.location ?? '',
  appliedAt: application.appliedAt ?? '',
  deadline: application.deadline ?? '',
  nextInterviewAt: application.nextInterviewAt
    ? toDateTimeLocal(application.nextInterviewAt)
    : '',
  salary: application.salary ?? '',
  coverLetter: application.coverLetter ?? '',
  notes: application.notes ?? '',
  resumeId: application.resumeId ?? '',
})
