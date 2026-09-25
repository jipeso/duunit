import { useEffect } from 'react'
import Alert from '@mui/material/Alert'

import type { NotificationItem } from './context'

const SUCCESS_DURATION_MS = 3000

interface NotificationProps {
  notification: NotificationItem
  onClose: (id: string) => void
}

const Notification = ({ notification, onClose }: NotificationProps) => {
  const { id, message, variant } = notification

  useEffect(() => {
    if (variant !== 'success') return

    const timer = setTimeout(() => {
      onClose(id)
    }, SUCCESS_DURATION_MS)

    return () => {
      clearTimeout(timer)
    }
  }, [id, variant, onClose])

  return (
    <Alert
      severity={variant}
      variant='filled'
      onClose={() => {
        onClose(id)
      }}
      sx={{ minWidth: 300 }}
    >
      {message}
    </Alert>
  )
}

export default Notification
