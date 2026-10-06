import { Router, type Response, type Request } from 'express'
import { z } from 'zod'

import { requireAuth } from '../../middleware/authentication.ts'
import applicationService from '../../services/applicationService.ts'
import {
  type ApplicationResponse,
  NewApplicationSchema,
  type StatusEventResponse,
  UpdateApplicationSchema,
} from '#common/types/applications.ts'

const router = Router()

router.use(requireAuth)

router.get('/', async (req: Request, res: Response<ApplicationResponse[]>) => {
  const applications = await applicationService.getApplications(req.user.id)
  res.json(applications)
})

router.get(
  '/:id/events',
  async (req: Request, res: Response<StatusEventResponse[]>) => {
    const applicationId = z.uuid().parse(req.params.id)
    const events = await applicationService.getStatusEvents(
      req.user.id,
      applicationId
    )

    res.json(events)
  }
)

router.post('/', async (req: Request, res: Response<ApplicationResponse>) => {
  const application = NewApplicationSchema.parse(req.body)

  const createdApplication = await applicationService.createApplication(
    req.user.id,
    application
  )
  res.status(201).json(createdApplication)
})

router.patch(
  '/:id',
  async (req: Request, res: Response<ApplicationResponse>) => {
    const applicationId = z.uuid().parse(req.params.id)
    const values = UpdateApplicationSchema.parse(req.body)

    const updatedApplication = await applicationService.updateApplication(
      req.user.id,
      applicationId,
      values
    )
    res.json(updatedApplication)
  }
)

router.delete('/:id', async (req: Request, res: Response) => {
  const applicationId = z.uuid().parse(req.params.id)

  await applicationService.deleteApplication(req.user.id, applicationId)
  res.status(204).end()
})

export default router
