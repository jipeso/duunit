export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'APPLICATION_NOT_FOUND'
  | 'STATUS_EVENT_NOT_FOUND'
  | 'LAST_STATUS_EVENT'
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
