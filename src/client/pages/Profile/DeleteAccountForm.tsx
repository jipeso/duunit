import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { deleteAccount } from '../../util/authClient'
import { useNotification } from '../../components/Notification'
import ConfirmDialog from '../../components/common/ConfirmDialog'

const deleteAccountSchema = z.object({ password: z.string().min(1) })

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>

const DeleteAccountForm = ({ onDone }: { onDone: () => void }) => {
  const { t } = useTranslation()
  const { showSuccess } = useNotification()
  const [confirming, setConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    mode: 'onTouched',
    reValidateMode: 'onSubmit',
  })

  const onSubmit: SubmitHandler<DeleteAccountFormData> = () => {
    setConfirming(true)
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    const { error } = await deleteAccount(getValues('password'))
    setIsDeleting(false)
    setConfirming(false)

    if (error) {
      if (error.code === 'INVALID_PASSWORD') {
        setError('password', { message: t('profile.wrongPassword') })
      } else {
        setError('root', {
          message: t(
            error.code === 'ADMIN_CANNOT_DELETE'
              ? 'profile.adminCannotDelete'
              : 'common.errors.unexpected'
          ),
        })
      }
      return
    }

    showSuccess(t('notifications.accountDeletedSuccess'))
  }

  return (
    <Box
      component='form'
      onSubmit={event => {
        void handleSubmit(onSubmit)(event)
      }}
      noValidate
    >
      <Stack spacing={2}>
        <Typography variant='body2' color='text.secondary'>
          {t('profile.deleteAccountWarning')}
        </Typography>

        <TextField
          required
          fullWidth
          size='small'
          type='password'
          label={t('fields.password')}
          autoComplete='current-password'
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            htmlInput: { 'data-testid': 'delete-account-password' },
          }}
        />

        {errors.root && <Alert severity='error'>{errors.root.message}</Alert>}

        <Stack direction='row' spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={onDone}>{t('common.buttons.cancel')}</Button>
          <Button
            type='submit'
            color='error'
            variant='contained'
            disableElevation
          >
            {t('profile.deleteAccount')}
          </Button>
        </Stack>
      </Stack>

      <ConfirmDialog
        open={confirming}
        title={t('profile.deleteAccountConfirmTitle')}
        message={t('profile.deleteAccountConfirmMessage')}
        confirmLabel={t('profile.deleteAccount')}
        onConfirm={() => void confirmDelete()}
        onClose={() => {
          setConfirming(false)
        }}
        isPending={isDeleting}
      />
    </Box>
  )
}

export default DeleteAccountForm
