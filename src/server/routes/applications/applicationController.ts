import { Router, type Response, type Request } from 'express'

import { requireAuth } from '../../middleware/authentication.ts'
import applicationService from '../../services/applicationService.ts'
import {
  type ApplicationResponse,
  NewApplicationSchema,
} from '#common/types/applications.ts'

const router = Router()

router.use(requireAuth)

router.get('/', async (req: Request, res: Response<ApplicationResponse[]>) => {
  const applications = await applicationService.getApplicationsByUserId(
    req.user.id
  )
  res.json(applications)
})

router.post('/', async (req: Request, res: Response<ApplicationResponse>) => {
  const application = NewApplicationSchema.parse(req.body)

  const createdApplication = await applicationService.createApplication(
    req.user.id,
    application
  )
  res.status(201).json(createdApplication)
})

export default router
