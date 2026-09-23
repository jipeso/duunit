import { Router } from 'express'
import morgan from 'morgan'

import authRouter from './auth/index.ts'
import usersRouter from './users/index.ts'

const router = Router()

router.use(morgan('combined'))

router.use(authRouter)
router.use('/users', usersRouter)

export { router }
