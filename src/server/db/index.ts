import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { sql } from 'drizzle-orm'
import path from 'node:path'

import * as schema from './schema.ts'
import { logger } from '../util/logger.ts'
import { withRetry } from '../util/withRetry.ts'
import { DATABASE_URL } from '../util/config.ts'

const DB_CONNECTION_ATTEMPTS = 5
const DB_CONNECTION_RETRY_DELAY_MS = 3000

const pool = new Pool({
  connectionString: DATABASE_URL,
})

export const db = drizzle({ client: pool, schema })

export const connectToDatabase = async (): Promise<void> => {
  await withRetry(
    async () => {
      await db.execute(sql`SELECT 1`)
      await runMigrations()
      logger.info('Connected to database succesfully')
    },
    DB_CONNECTION_ATTEMPTS,
    DB_CONNECTION_RETRY_DELAY_MS,
    (error, attempt) => {
      logger.error(
        `Database connection attempt ${String(attempt)} failed`,
        error
      )
    }
  )
}

export const runMigrations = async (): Promise<void> => {
  await migrate(db, {
    migrationsFolder: path.resolve(import.meta.dirname, './migrations'),
  })
  logger.info('Migrations up to date')
}
