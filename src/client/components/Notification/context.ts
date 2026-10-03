import { createContext, use } from 'react'

const NotificationContext = createContext<{
  showSuccess: (message: string) => void
  showError: (message: string) => void
}>({ showSuccess: () => undefined, showError: () => undefined })

export const useNotification = () => use(NotificationContext)

export default NotificationContext
