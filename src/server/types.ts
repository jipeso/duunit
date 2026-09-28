import { type users } from './db/schema.ts'

export type DatabaseUser = typeof users.$inferSelect

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: DatabaseUser
    }
  }
}
