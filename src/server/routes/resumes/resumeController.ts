import express, { Router, type Response, type Request } from 'express'
import { z } from 'zod'

import { requireAuth } from '../../middleware/authentication.ts'
import resumeService from '../../services/resumeService.ts'
import { AppError } from '../../util/AppError.ts'
import {
  MAX_RESUME_BYTES,
  ResumeFileNameSchema,
  type ResumeResponse,
} from '#common/types/resumes.ts'

const PDF_SIGNATURE = '%PDF-'

const router = Router()

router.use(requireAuth)

router.get('/', async (req: Request, res: Response<ResumeResponse[]>) => {
  const resumes = await resumeService.getResumes(req.user.id)
  res.json(resumes)
})

router.get('/:id/file', async (req: Request, res: Response) => {
  const resumeId = z.uuid().parse(req.params.id)
  const { fileName, data } = await resumeService.getResumeFile(
    req.user.id,
    resumeId
  )

  res
    .type('application/pdf')
    .set({
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      'X-Content-Type-Options': 'nosniff',
    })
    .send(data)
})

router.post(
  '/',
  express.raw({ type: 'application/pdf', limit: MAX_RESUME_BYTES }),
  async (req: Request, res: Response<ResumeResponse>) => {
    const fileName = ResumeFileNameSchema.parse(req.query.name)
    const data: unknown = req.body

    if (
      !Buffer.isBuffer(data) ||
      data.subarray(0, PDF_SIGNATURE.length).toString() !== PDF_SIGNATURE
    ) {
      throw new AppError('INVALID_FILE', 400)
    }

    const resume = await resumeService.createResume(
      req.user.id,
      fileName,
      data
    )
    res.status(201).json(resume)
  }
)

router.delete('/:id', async (req: Request, res: Response) => {
  const resumeId = z.uuid().parse(req.params.id)

  await resumeService.deleteResume(req.user.id, resumeId)
  res.status(204).end()
})

export default router
