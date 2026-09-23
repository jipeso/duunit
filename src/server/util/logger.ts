import winston, { createLogger, format } from 'winston'

import { inProduction, inTest } from './config.ts'

const { combine, timestamp, splat, printf, json } = format
const transports: winston.transport[] = []

if (!inTest) {
  transports.push(new winston.transports.File({ filename: 'logs/debug.log' }))
}

if (!inProduction) {
  const devFormat = combine(
    timestamp({ format: 'HH:mm:ss' }),
    printf(({ timestamp, level, message, ...meta }) => {
      const metaString = Object.keys(meta).length ? JSON.stringify(meta) : ''
      return `${String(timestamp)} ${level}: ${String(message)} ${metaString}`
    })
  )

  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: combine(splat(), timestamp(), devFormat),
    })
  )
}

if (inProduction) {
  const prodFormat = combine(timestamp(), json())

  transports.push(
    new winston.transports.Console({
      level: 'info',
      format: prodFormat,
    })
  )
}

export const logger = createLogger({ transports })
