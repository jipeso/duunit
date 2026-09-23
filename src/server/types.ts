import { type users } from './db/index.ts'

export type DatabaseUser = typeof users.$inferSelect

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: DatabaseUser
    }
  }
}
