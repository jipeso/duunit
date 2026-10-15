import { Router } from 'express'
import morgan from 'morgan'

import applicationsRouter from './applications/index.ts'
import resumesRouter from './resumes/index.ts'
import jobAnalysisRouter from './jobAnalysis/index.ts'
import adminRouter from './admin/index.ts'

const router = Router()

router.use(morgan('combined'))

router.use('/applications', applicationsRouter)
router.use('/resumes', resumesRouter)
router.use('/job-analysis', jobAnalysisRouter)
router.use('/admin', adminRouter)

export { router }
