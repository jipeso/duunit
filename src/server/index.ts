import app from './app.ts'
import { logger } from './util/logger.ts'
import { PORT } from './util/config.ts'
import { connectToDatabase } from './db/index.ts'

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    logger.info(`Server running on port ${String(PORT)}`)
  })
}

void start()
