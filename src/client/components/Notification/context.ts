import { createContext } from 'react'

export type NotificationVariant = 'success' | 'error'

export interface NotificationItem {
  id: string
  message: string
  variant: NotificationVariant
}

export interface NotificationContextValue {
  showSuccess: (message: string) => void
  showError: (message: string) => void
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
)

export default NotificationContext
