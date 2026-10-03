import { useMemo, useState, type ReactNode } from 'react'
import Alert, { type AlertColor } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

import NotificationContext from './context'

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('success')
  const [open, setOpen] = useState(false)

  const value = useMemo(() => {
    const show = (newSeverity: AlertColor) => (newMessage: string) => {
      setMessage(newMessage)
      setSeverity(newSeverity)
      setOpen(true)
    }

    return { showSuccess: show('success'), showError: show('error') }
  }, [])

  return (
    <NotificationContext value={value}>
      {children}
      <Snackbar
        key={message}
        open={open}
        autoHideDuration={3000}
        onClose={() => {
          setOpen(false)
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={severity} variant='filled'>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext>
  )
}

export default NotificationProvider
