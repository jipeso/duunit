import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useTranslation } from 'react-i18next'
import LogoutIcon from '@mui/icons-material/Logout'

import Modal from '../common/Modal'
import ThemeSelect from '../common/ThemeSelect'
import LanguageSelect from '../common/LanguageSelect'
import useAuth from '../../hooks/useAuth'
import { useNotification } from '../Notification'

interface Props {
  open: boolean
  onClose: () => void
}

const Settings = ({ open, onClose }: Props) => {
  const { t } = useTranslation()
  const { state, logout, isLoggingOut } = useAuth()
  const { showSuccess } = useNotification()
  const isLoggedIn = state.status === 'authenticated'

  const handleLogout = async () => {
    await logout()
    showSuccess(t('notifications.logoutSuccess'))
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={t('common.settings')}>
      <Stack spacing={2} sx={{ pt: 1 }}>
        <Stack
          direction='row'
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant='body2'>{t('common.languages.label')}</Typography>
          <LanguageSelect />
        </Stack>
        <Stack
          direction='row'
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant='body2'>{t('common.themes.label')}</Typography>
          <ThemeSelect />
        </Stack>
        {isLoggedIn && (
          <Button
            onClick={() => {
              void handleLogout()
            }}
            disabled={isLoggingOut}
            startIcon={
              isLoggingOut ? <CircularProgress size={16} /> : <LogoutIcon />
            }
          >
            {t('common.logout')}
          </Button>
        )}
      </Stack>
    </Modal>
  )
}

export default Settings
