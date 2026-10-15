import { Router, type Request, type Response } from 'express'

import { requireAdmin, requireAuth } from '../../middleware/authentication.ts'
import adminService from '../../services/adminService.ts'
import type { AdminUser } from '#common/types/admin.ts'

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/users', async (_: Request, res: Response<AdminUser[]>) => {
  const users = await adminService.getUsers()
  res.json(users)
})

export default router
