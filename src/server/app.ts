import express, { type Request, type Response } from 'express'
import path from 'path'
import { toNodeHandler } from 'better-auth/node'

import { errorHandler } from './middleware/errorHandler.ts'
import { inProduction, inTest, inDevelopment } from './util/config.ts'
import { router } from './routes/index.ts'
import { auth } from './util/auth.ts'
import { AppError } from './util/AppError.ts'

const app = express()

app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json())

app.use('/api', router)
app.use('/api', () => {
  throw new AppError('NOT_FOUND', 404)
})

if (inDevelopment || inTest) {
  const { default: testRouter } = await import('./test/index.ts')
  app.use('/test', testRouter)
}

if (inProduction || inTest) {
  const BUILD_PATH = path.resolve('dist/client')
  const INDEX_PATH = path.join(BUILD_PATH, 'index.html')

  app.use(express.static(BUILD_PATH))
  app.get('*static', (_: Request, res: Response) => {
    res.sendFile(INDEX_PATH)
  })
}

app.use(errorHandler)

export default app
