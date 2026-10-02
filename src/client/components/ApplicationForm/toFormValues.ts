import type {
  ApplicationResponse,
  NewApplicationInput,
} from '#common/types/applications.ts'

export const toFormValues = (
  application: ApplicationResponse
): NewApplicationInput => ({
  company: application.company,
  position: application.position,
  status: application.status,
  jobPostingUrl: application.jobPostingUrl ?? '',
  location: application.location ?? '',
  appliedAt: application.appliedAt ?? '',
  coverLetter: application.coverLetter ?? '',
})
