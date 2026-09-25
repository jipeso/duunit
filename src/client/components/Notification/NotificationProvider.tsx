import { useCallback, useMemo, useState, type ReactNode } from 'react'
import Stack from '@mui/material/Stack'

import Notification from './Notification'
import NotificationContext, {
  type NotificationContextValue,
  type NotificationItem,
  type NotificationVariant,
} from './context'

const MAX_NOTIFICATIONS = 3

interface Props {
  children: ReactNode
}

const NotificationProvider = ({ children }: Props) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const dismissNotification = useCallback((id: string) => {
    setNotifications(current => current.filter(item => item.id !== id))
  }, [])

  const showNotification = useCallback(
    (message: string, variant: NotificationVariant) => {
      const notification: NotificationItem = {
        id: crypto.randomUUID(),
        message,
        variant,
      }

      setNotifications(current =>
        [...current, notification].slice(-MAX_NOTIFICATIONS)
      )
    },
    []
  )

  const showSuccess = useCallback(
    (message: string) => {
      showNotification(message, 'success')
    },
    [showNotification]
  )

  const showError = useCallback(
    (message: string) => {
      showNotification(message, 'error')
    },
    [showNotification]
  )

  const value = useMemo<NotificationContextValue>(
    () => ({ showSuccess, showError }),
    [showSuccess, showError]
  )

  return (
    <NotificationContext value={value}>
      {children}
      <Stack
        spacing={1}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: theme => theme.zIndex.snackbar,
        }}
      >
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={dismissNotification}
          />
        ))}
      </Stack>
    </NotificationContext>
  )
}

export default NotificationProvider
