import { Router, type Response, type Request } from 'express'

import { requireAuth } from '../../middleware/authentication.ts'
import jobAnalysisService from '../../services/jobAnalysisService.ts'
import {
  AnalyzeDescriptionSchema,
  type DescriptionAnalysis,
} from '#common/types/jobAnalysis.ts'

const router = Router()

router.use(requireAuth)

router.post('/', async (req: Request, res: Response<DescriptionAnalysis>) => {
  const values = AnalyzeDescriptionSchema.parse(req.body)

  const controller = new AbortController()
  res.on('close', () => {
    controller.abort()
  })

  const analysis = await jobAnalysisService.analyzeDescription(
    values,
    controller.signal
  )
  res.json(analysis)
})

export default router
