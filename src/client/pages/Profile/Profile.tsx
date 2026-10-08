import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
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
import ChangePasswordForm from './ChangePasswordForm'

const Profile = () => {
  const { t } = useTranslation()
  const { showSuccess } = useNotification()
  const { data: session } = authClient.useSession()
  const [name, setName] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string>()
  const [changingPassword, setChangingPassword] = useState(false)

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
    <Container maxWidth='sm' sx={{ mt: 4, mb: 8 }}>
      <Paper variant='outlined' sx={{ p: 3 }}>
        <Typography variant='h5' gutterBottom>
          {t('profile.details')}
        </Typography>

        <Stack spacing={2}>
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

          <Divider />

          {changingPassword ? (
            <ChangePasswordForm
              onDone={() => {
                setChangingPassword(false)
              }}
            />
          ) : (
            <Box>
              <Button
                onClick={() => {
                  setChangingPassword(true)
                }}
              >
                {t('profile.updatePassword')}
              </Button>
            </Box>
          )}
        </Stack>
      </Paper>
    </Container>
  )
}

export default Profile
