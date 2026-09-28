import Router, { type Request, type Response } from 'express'
import morgan from 'morgan'

import { db } from '../db/index.ts'
import { sessions, users } from '../db/schema.ts'
import { inProduction } from '../util/config.ts'
import { AppError } from '../util/AppError.ts'

const resetDatabase = async (_: Request, res: Response) => {
  await db.delete(sessions)
  await db.delete(users)
  res.sendStatus(204)
}
const router = Router()

router.use((_, __, next) => {
  if (inProduction) {
    throw new AppError('Testing route called in production', 500)
  }
  next()
})

router.use(morgan('dev'))
router.delete('/reset', resetDatabase)

export default router
