import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useTranslation } from 'react-i18next'
import LogoutIcon from '@mui/icons-material/Logout'

import Modal from '../common/Modal'
import ThemeSelect from '../common/ThemeSelect'
import LanguageSelect from '../common/LanguageSelect'
import { authClient, signOut } from '../../util/authClient'
import { useNotification } from '../Notification'

interface Props {
  open: boolean
  onClose: () => void
}

const Settings = ({ open, onClose }: Props) => {
  const { t } = useTranslation()
  const { data: session } = authClient.useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { showSuccess } = useNotification()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut()
    setIsLoggingOut(false)
    showSuccess(t('notifications.logoutSuccess'))
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={t('navigation.settings')}>
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
        {session && (
          <Button
            onClick={() => {
              void handleLogout()
            }}
            disabled={isLoggingOut}
            startIcon={
              isLoggingOut ? <CircularProgress size={16} /> : <LogoutIcon />
            }
          >
            {t('navigation.logout')}
          </Button>
        )}
      </Stack>
    </Modal>
  )
}

export default Settings
