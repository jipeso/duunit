import Router, { type Request, type Response } from 'express'
import morgan from 'morgan'

import { db } from '../db/index.ts'
import { users } from '../db/schema.ts'

const resetDatabase = async (_: Request, res: Response) => {
  await db.delete(users)
  res.sendStatus(204)
}
const router = Router()

router.use(morgan('dev'))
router.delete('/reset', resetDatabase)

export default router
