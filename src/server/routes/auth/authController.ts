import { Router, type Request, type Response } from 'express'

import { userExtractor } from '../../middleware/userExtractor.ts'
import authService, {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '../../services/authService.ts'
import { toPublicUser } from '../../services/utils.ts'
import { AppError } from '../../util/AppError.ts'
import { inProduction } from '../../util/config.ts'
import { LoginSchema, type PublicUser } from '#common/types/users.ts'

const router = Router()

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie('authToken', accessToken, {
    httpOnly: true,
    secure: inProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TOKEN_MAX_AGE,
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: inProduction,
    sameSite: 'lax',
    path: '/api',
    maxAge: REFRESH_TOKEN_MAX_AGE,
  })
}

router.get('/me', userExtractor, (req: Request, res: Response<PublicUser>) => {
  if (!req.user) {
    throw new AppError('unauthorized', 401)
  }

  res.json(toPublicUser(req.user))
})

router.post('/login', async (req: Request, res: Response<PublicUser>) => {
  const credentials = LoginSchema.parse(req.body)
  const { user, accessToken, refreshToken } =
    await authService.login(credentials)

  setAuthCookies(res, accessToken, refreshToken)

  res.json(toPublicUser(user))
})

router.post('/refresh', async (req, res: Response<PublicUser>) => {
  const cookies = req.cookies as Record<string, unknown>
  const refreshToken = cookies.refreshToken

  if (typeof refreshToken !== 'string' || !refreshToken) {
    throw new AppError('refresh token missing', 401)
  }

  const {
    user,
    accessToken,
    refreshToken: rotatedRefreshToken,
  } = await authService.refresh(refreshToken)

  setAuthCookies(res, accessToken, rotatedRefreshToken)
  res.json(toPublicUser(user))
})

router.delete('/logout', async (req, res) => {
  const cookies = req.cookies as Record<string, unknown>
  const refreshToken = cookies.refreshToken
  await authService.logout(
    typeof refreshToken === 'string' ? refreshToken : undefined
  )

  res.clearCookie('authToken', {
    httpOnly: true,
    secure: inProduction,
    sameSite: 'lax',
    path: '/',
  })
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: inProduction,
    sameSite: 'lax',
    path: '/api',
  })
  res.sendStatus(204)
})

export default router
