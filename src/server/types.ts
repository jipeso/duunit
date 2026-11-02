import type { AuthUser } from './util/auth.ts'

declare global {
  // oxlint-disable-next-line typescript/no-namespace
  namespace Express {
    interface Request {
      user: AuthUser
    }
  }
}
