import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useTranslation } from 'react-i18next'
import LogoutIcon from '@mui/icons-material/Logout'

import Modal from '../common/Modal'
import ThemeSelect from '../common/ThemeSelect'
import LanguageSelect from '../common/LanguageSelect'
import useLogout from '../../hooks/useLogout'
import { useAuth } from '../AuthProvider'

interface Props {
  open: boolean
  onClose: () => void
}

const Settings = ({ open, onClose }: Props) => {
  const { t } = useTranslation()
  const { mutateAsync: logout, isPending } = useLogout()
  const { user } = useAuth()

  const handleLogout = async () => {
    await logout()
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
        {user && (
          <Button
            onClick={() => {
              void handleLogout()
            }}
            disabled={isPending}
            startIcon={
              isPending ? <CircularProgress size={16} /> : <LogoutIcon />
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
