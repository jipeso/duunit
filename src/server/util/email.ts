import { createTransport } from 'nodemailer'

import { EMAIL_FROM, SMTP_URL, inProduction } from './config.ts'
import { logger } from './logger.ts'

const transporter = inProduction ? createTransport(SMTP_URL) : null

export const sendEmail = async (to: string, subject: string, text: string) => {
  if (!transporter) {
    logger.info(`Email to ${to}: ${subject}\n${text}`)
    return
  }

  await transporter.sendMail({ from: EMAIL_FROM, to, subject, text })
}
