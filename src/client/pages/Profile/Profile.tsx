import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import { useTranslation } from 'react-i18next'

import { nameField } from '#common/types/common.ts'
import { authClient } from '../../util/authClient'
import { useNotification } from '../../components/Notification'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Section from '../../components/common/Section'
import ChangePasswordForm from './ChangePasswordForm'
import DeleteAccountForm from './DeleteAccountForm'
import ProfileAction from './ProfileAction'

const Profile = () => {
  const { t, i18n } = useTranslation()
  const { showSuccess } = useNotification()
  const { data: session } = authClient.useSession()
  const [name, setName] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string>()
  const [changingPassword, setChangingPassword] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [confirmingDownload, setConfirmingDownload] = useState(false)

  if (!session) return null

  const { user } = session

  const cancelName = () => {
    setName(null)
    setNameError(undefined)
  }

  const saveName = async () => {
    const result = nameField.safeParse(name)
    if (!result.success) {
      setNameError(result.error.issues[0]?.message)
      return
    }

    if (result.data === user.name) {
      cancelName()
      return
    }

    const { error } = await authClient.updateUser({ name: result.data })
    if (error) {
      setNameError(t('common.errors.unexpected'))
      return
    }

    cancelName()
    showSuccess(t('notifications.nameUpdatedSuccess'))
  }

  return (
    <Container maxWidth='sm'>
      <Typography component='h1' variant='h5' gutterBottom>
        {t('navigation.profile')}
      </Typography>

      <Stack spacing={3}>
        <Section title={t('profile.account')}>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              {t('fields.name')}
            </Typography>
            {name === null ? (
              <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant='body1'>{user.name}</Typography>
                <IconButton
                  size='small'
                  aria-label={t('common.buttons.edit')}
                  onClick={() => {
                    setName(user.name)
                  }}
                >
                  <EditIcon fontSize='small' />
                </IconButton>
              </Stack>
            ) : (
              <Stack
                direction='row'
                spacing={1}
                sx={{ alignItems: 'flex-start' }}
              >
                <TextField
                  autoFocus
                  fullWidth
                  size='small'
                  value={name}
                  onChange={e => {
                    setName(e.target.value)
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') void saveName()
                    if (e.key === 'Escape') cancelName()
                  }}
                  error={!!nameError}
                  helperText={nameError}
                />
                <IconButton
                  aria-label={t('common.buttons.update')}
                  onClick={() => void saveName()}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  aria-label={t('common.buttons.cancel')}
                  onClick={cancelName}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            )}
          </Box>

          <Box>
            <Typography variant='body2' color='text.secondary'>
              {t('fields.email')}
            </Typography>
            <Typography variant='body1'>{user.email}</Typography>
          </Box>

          <Box>
            <Typography variant='body2' color='text.secondary'>
              {t('profile.accountCreated')}
            </Typography>
            <Typography variant='body1'>
              {user.createdAt.toLocaleDateString(i18n.language)}
            </Typography>
          </Box>
        </Section>

        <Section title={t('profile.security')}>
          {changingPassword ? (
            <ChangePasswordForm
              onDone={() => {
                setChangingPassword(false)
              }}
            />
          ) : (
            <ProfileAction description={t('profile.passwordDescription')}>
              <Button
                variant='outlined'
                sx={{ flexShrink: 0 }}
                onClick={() => {
                  setChangingPassword(true)
                }}
              >
                {t('profile.updatePassword')}
              </Button>
            </ProfileAction>
          )}
        </Section>

        <Section title={t('profile.yourData')}>
          <ProfileAction description={t('profile.downloadDataDescription')}>
            <Button
              variant='outlined'
              sx={{ flexShrink: 0 }}
              onClick={() => {
                setConfirmingDownload(true)
              }}
            >
              {t('profile.downloadData')}
            </Button>
          </ProfileAction>

          {deletingAccount ? (
            <DeleteAccountForm
              onDone={() => {
                setDeletingAccount(false)
              }}
            />
          ) : (
            <ProfileAction description={t('profile.deleteAccountDescription')}>
              <Button
                variant='outlined'
                color='error'
                sx={{ flexShrink: 0 }}
                onClick={() => {
                  setDeletingAccount(true)
                }}
              >
                {t('profile.deleteAccount')}
              </Button>
            </ProfileAction>
          )}
        </Section>
      </Stack>

      <ConfirmDialog
        open={confirmingDownload}
        title={t('profile.downloadDataConfirmTitle')}
        message={t('profile.downloadDataConfirmMessage')}
        confirmLabel={t('profile.downloadData')}
        confirmColor='primary'
        onConfirm={() => {
          setConfirmingDownload(false)
          window.location.assign('/api/account/export')
        }}
        onClose={() => {
          setConfirmingDownload(false)
        }}
      />
    </Container>
  )
}

export default Profile
