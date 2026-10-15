export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'APPLICATION_NOT_FOUND'
  | 'STATUS_EVENT_NOT_FOUND'
  | 'LAST_STATUS_EVENT'
  | 'EVENT_DATE_OUT_OF_ORDER'
  | 'RESUME_NOT_FOUND'
  | 'RESUME_LIMIT_REACHED'
  | 'INVALID_FILE'
  | 'NOT_JOB_DESCRIPTION'
  | 'ANALYSIS_LIMIT_REACHED'
  | 'INTERNAL_ERROR'

export class AppError extends Error {
  code: ErrorCode
  status: number

  constructor(code: ErrorCode, status: number, message: string = code) {
    super(message)
    this.code = code
    this.status = status
  }
}
