import type { Request, Response, NextFunction } from 'express'

export const requireRole = (...allowed: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'unauthorized' })
      return
    }

    const hasRole = req.user.roles.some(role => allowed.includes(role))

    if (!hasRole) {
      res.status(403).json({ error: 'insufficient permissions' })
      return
    }

    next()
  }
}

export const requireSelf = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  if (req.user.id !== req.params.id) {
    res.status(403).json({ error: 'can only update your own information' })
    return
  }

  next()
}
