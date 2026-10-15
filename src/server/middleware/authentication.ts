import type { Request, Response, NextFunction } from 'express'
import { fromNodeHeaders } from 'better-auth/node'

import { auth } from '../util/auth.ts'
import { AppError } from '../util/AppError.ts'

export const requireAuth = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!session) {
    throw new AppError('UNAUTHORIZED', 401)
  }

  req.user = session.user
  next()
}

export const requireAdmin = (req: Request, _: Response, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    throw new AppError('FORBIDDEN', 403)
  }

  next()
}
