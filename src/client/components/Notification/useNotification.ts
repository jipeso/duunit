import { use } from 'react'

import NotificationContext, {
  type NotificationContextValue,
} from './context'

const useNotification = (): NotificationContextValue => {
  const context = use(NotificationContext)

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }

  return context
}

export default useNotification
