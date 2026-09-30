import type { Request, Response, NextFunction } from 'express'
import { fromNodeHeaders } from 'better-auth/node'

import { auth } from '../util/auth.ts'

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!session) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  req.user = session.user
  next()
}
