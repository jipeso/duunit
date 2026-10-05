import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

import { AppError } from '../util/AppError.ts'
import { logger } from '../util/logger.ts'

const toAppError = (err: Error): AppError => {
  if (err instanceof AppError) return err
  if (err instanceof ZodError) {
    const message = err.issues
      .map(issue => [...issue.path, issue.message].join(': '))
      .join('; ')
    return new AppError('VALIDATION_ERROR', 400, message)
  }
  if ('status' in err && typeof err.status === 'number' && err.status < 500) {
    return new AppError('BAD_REQUEST', err.status, err.message)
  }
  return new AppError('INTERNAL_ERROR', 500)
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req,
  res,
  next
) => {
  const { code, status, message } = toAppError(err)
  const request = `${req.method} ${req.originalUrl}`

  if (status >= 500) {
    logger.error(`${request} ${err.name}: ${err.message} ${err.stack ?? ''}`)
  } else {
    logger.warn(`${request} ${String(status)} ${code}`)
  }

  if (res.headersSent) {
    next(err)
    return
  }

  res.status(status).json({ code, message })
}
