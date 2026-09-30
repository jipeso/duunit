import { createContext, use } from 'react'

const NotificationContext = createContext<{
  showSuccess: (message: string) => void
}>({ showSuccess: () => undefined })

export const useNotification = () => use(NotificationContext)

export default NotificationContext
