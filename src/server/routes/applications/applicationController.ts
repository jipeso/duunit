import { Router, type Response, type Request } from 'express'
import { z } from 'zod'

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

router.put('/:id', async (req: Request, res: Response<ApplicationResponse>) => {
  const applicationId = z.uuid().parse(req.params.id)
  const application = NewApplicationSchema.parse(req.body)

  const updatedApplication = await applicationService.updateApplication(
    req.user.id,
    applicationId,
    application
  )
  res.json(updatedApplication)
})

router.delete('/:id', async (req: Request, res: Response) => {
  const applicationId = z.uuid().parse(req.params.id)

  await applicationService.deleteApplication(req.user.id, applicationId)
  res.status(204).end()
})

export default router
