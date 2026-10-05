import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express'
import { z, ZodError } from 'zod'

import { AppError } from '../util/AppError.ts'
import { logger } from '../util/logger.ts'

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`${err.message} ${err.name} ${err.stack ?? ''}`)

  if (res.headersSent) {
    next(err)
    return
  }

  if (err instanceof AppError) {
    res.status(err.status).json(err)
  } else if (err instanceof ZodError) {
    res
      .status(400)
      .json({ error: 'validation error', details: z.flattenError(err) })
  } else {
    res.status(500).json({ error: 'internal server error' })
  }
}
