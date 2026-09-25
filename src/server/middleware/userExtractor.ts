import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import { eq } from 'drizzle-orm'

import { db, users } from '../db/index.ts'
import { JWT_SECRET } from '../util/config.ts'
import type { UserRole } from '#common/types/common.ts'

export const userExtractor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token: unknown = req.cookies.authToken

  if (typeof token !== 'string' || !token) {
    res.status(401).json({ error: 'token missing' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string
      roles: UserRole[]
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    })

    if (!user) {
      res.status(401).json({ error: 'user not found' })
      return
    }

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
