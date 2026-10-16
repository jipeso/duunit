import { Router, type Request, type Response } from 'express'

import { requireAuth } from '../../middleware/authentication.ts'
import accountService from '../../services/accountService.ts'

const router = Router()

router.use(requireAuth)

router.get('/export', async (req: Request, res: Response) => {
  const data = await accountService.exportData(req.user.id)
  const date = data.exportedAt.toISOString().slice(0, 10)

  res.attachment(`duunit-data-${date}.json`).send(JSON.stringify(data, null, 2))
})

export default router
