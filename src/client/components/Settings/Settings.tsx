import { useState, type ReactNode } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
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

const SettingSection = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => (
  <Stack spacing={1}>
    <Typography variant='subtitle2' color='text.secondary'>
      {label}
    </Typography>
    {children}
  </Stack>
)

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
        {session && (
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {session.user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant='subtitle1' noWrap>
                {session.user.name}
              </Typography>
              <Typography variant='body2' color='text.secondary' noWrap>
                {session.user.email}
              </Typography>
            </Box>
          </Stack>
        )}
        <SettingSection label={t('common.languages.label')}>
          <LanguageSelect />
        </SettingSection>
        <SettingSection label={t('common.themes.label')}>
          <ThemeSelect />
        </SettingSection>
        {session && (
          <>
            <Divider />
            <Button
              variant='outlined'
              color='error'
              fullWidth
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
          </>
        )}
      </Stack>
    </Modal>
  )
}

export default Settings
