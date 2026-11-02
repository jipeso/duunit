import { Router, type Response, type Request } from 'express'

import { requireAuth } from '../../middleware/authentication.ts'
import jobAnalysisService from '../../services/jobAnalysisService.ts'
import {
  AnalyzeDescriptionSchema,
  type AnalysisUsage,
  type DescriptionAnalysis,
} from '#common/types/jobAnalysis.ts'

const router = Router()

router.use(requireAuth)

router.get('/usage', async (req: Request, res: Response<AnalysisUsage>) => {
  res.json(await jobAnalysisService.getUsage(req.user.id))
})

router.post('/', async (req: Request, res: Response<DescriptionAnalysis>) => {
  const values = AnalyzeDescriptionSchema.parse(req.body)
  const analysis = await jobAnalysisService.analyzeDescription(
    req.user.id,
    values
  )

  res.json(analysis)
})

export default router
