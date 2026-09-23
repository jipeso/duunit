import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express'
import { ZodError } from 'zod'
import jwt from 'jsonwebtoken'

import { AppError } from '../util/AppError.ts'
import { logger } from '../util/logger.ts'

const hasErrorCode = (error: unknown, code: string): boolean => {
  if (!error || typeof error !== 'object') {
    return false
  }

  const cause = error as { code?: unknown; cause?: unknown }

  return cause.code === code || hasErrorCode(cause.cause, code)
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!(err instanceof Error)) {
    next(err)
    return
  }

  logger.error(`${err.message} ${err.name} ${err.stack ?? ''}`)

  if (res.headersSent) {
    next(err)
    return
  }

  let normalizedError: AppError

  if (err instanceof AppError) {
    normalizedError = err
  } else if (err instanceof ZodError) {
    normalizedError = new AppError('validation error', 400)
  } else if (err instanceof jwt.TokenExpiredError) {
    normalizedError = new AppError('token expired', 401)
  } else if (err instanceof jwt.JsonWebTokenError) {
    normalizedError = new AppError('invalid token', 401)
  } else if (hasErrorCode(err, '23505')) {
    normalizedError = new AppError('postgres unique violation', 400)
  } else {
    normalizedError = new AppError(err.message)
  }

  res.status(normalizedError.status).json(normalizedError)

  next(err)
}
