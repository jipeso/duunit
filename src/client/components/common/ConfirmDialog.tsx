import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onClose: () => void
  isPending?: boolean
  error?: string | null
}

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
  isPending = false,
  error,
}: Props) => {
  const { t } = useTranslation()

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth='xs'
      aria-labelledby='confirm-dialog-title'
      aria-describedby='confirm-dialog-message'
    >
      <DialogTitle id='confirm-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='confirm-dialog-message'>
          {message}
        </DialogContentText>
        {error && (
          <Alert severity='error' sx={{ mt: 2, borderRadius: 1 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={isPending}
          autoFocus
          data-testid='confirm-dialog-cancel'
        >
          {t('common.buttons.cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isPending}
          color='error'
          variant='contained'
          disableElevation
          data-testid='confirm-dialog-confirm'
        >
          {isPending ? (
            <CircularProgress size={20} color='inherit' />
          ) : (
            confirmLabel
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
