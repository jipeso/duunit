import { Router, type Response, type Request } from 'express'

import { userExtractor } from '../../middleware/userExtractor.ts'
import { requireRole } from '../../middleware/authentication.ts'
import { requireSelf } from '../../middleware/authentication.ts'
import applicationService from '../../services/applicationService.ts'
import {
  type ApplicationResponse,
  NewApplicationSchema,
} from '#common/types/applications.ts'
import { AppError } from '../../util/AppError.ts'

const router = Router()

router.get(
  '/',
  userExtractor,
  requireRole('admin'),
  async (_, res: Response<ApplicationResponse[]>) => {
    const applications = await applicationService.getApplications()
    res.json(applications)
  }
)

router.get(
  '/:id',
  userExtractor,
  requireSelf,
  async (
    req: Request<{ id: string }>,
    res: Response<ApplicationResponse[]>
  ) => {
    const { id } = req.params

    const applications = await applicationService.getApplicationsByUserId(id)
    res.json(applications)
  }
)

router.post(
  '/',
  userExtractor,
  async (req: Request, res: Response<ApplicationResponse>) => {
    if (!req.user) {
      throw new AppError('unauthorized', 401)
    }

    const application = NewApplicationSchema.parse(req.body)

    const createdApplication = await applicationService.createApplication(
      req.user.id,
      application
    )
    res.status(201).json(createdApplication)
  }
)

export default router
