import { useMemo, useState, type ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

import NotificationContext from './context'

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)

  const value = useMemo(
    () => ({
      showSuccess: (newMessage: string) => {
        setMessage(newMessage)
        setOpen(true)
      },
    }),
    []
  )

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
        <Alert severity='success' variant='filled'>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext>
  )
}

export default NotificationProvider
