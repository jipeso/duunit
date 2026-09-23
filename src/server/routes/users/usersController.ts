import { Router, type Response, type Request } from 'express'

import { userExtractor } from '../../middleware/userExtractor.ts'
import { requireRole, requireSelf } from '../../middleware/authentication.ts'
import userService from '../../services/userService.ts'
import {
  type PublicUser,
  NewUserSchema,
  UpdateUserProfileSchema,
  UpdateUserPasswordSchema,
} from '#common/types/users.ts'

const router = Router()

router.get(
  '/',
  userExtractor,
  requireRole('admin'),
  async (_, res: Response<PublicUser[]>) => {
    const users = await userService.getUsers()
    res.json(users)
  }
)

router.post('/', async (req: Request, res: Response<PublicUser>) => {
  const { name, email, password } = NewUserSchema.parse(req.body)

  const addedUser = await userService.createUser({ name, email, password })

  res.status(201).json(addedUser)
})

router.put(
  '/:id',
  userExtractor,
  requireSelf,
  async (
    req: Request<{ id: string }>,
    res: Response<PublicUser | { error: string }>
  ) => {
    const { id } = req.params

    const payload = UpdateUserProfileSchema.parse(req.body)

    const updatedUser = await userService.updateUserProfile(id, payload)
    res.json(updatedUser)
  }
)

router.put(
  '/:id/password',
  userExtractor,
  requireSelf,
  async (
    req: Request<{ id: string }>,
    res: Response<{ message: string } | { error: string }>
  ) => {
    const { id } = req.params

    const payload = UpdateUserPasswordSchema.parse(req.body)

    await userService.updateUserPassword(id, payload)

    res.status(200).json({ message: 'Password updated successfully' })
  }
)

export default router
