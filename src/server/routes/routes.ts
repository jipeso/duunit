import { Router } from 'express'
import morgan from 'morgan'

import applicationsRouter from './applications/index.ts'

const router = Router()

router.use(morgan('combined'))

router.use('/applications', applicationsRouter)

export { router }
