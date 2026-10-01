import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import i18n from '../../util/i18n'
import { ChangePasswordSchema } from '#common/types/users.ts'
import { authClient } from '../../util/authClient'
import { useNotification } from '../../components/Notification'

const changePasswordSchema = ChangePasswordSchema.extend({
  confirmPassword: z.string().min(1),
})
  .refine(data => data.newPassword !== data.currentPassword, {
    error: () => i18n.t('validation.passwordUnchanged'),
    path: ['newPassword'],
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    error: () => i18n.t('validation.passwordsDoNotMatch'),
    path: ['confirmPassword'],
  })

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

const ChangePasswordForm = ({ onDone }: { onDone: () => void }) => {
  const { t } = useTranslation()
  const { showSuccess } = useNotification()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    reValidateMode: 'onSubmit',
  })

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async data => {
    const { error } = await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      revokeOtherSessions: true,
    })

    if (error) {
      const wrongPassword = error.code === 'INVALID_PASSWORD'
      setError(wrongPassword ? 'currentPassword' : 'root', {
        message: t(
          wrongPassword ? 'profile.wrongPassword' : 'common.errors.unexpected'
        ),
      })
      return
    }

    showSuccess(t('notifications.passwordUpdatedSuccess'))
    onDone()
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
        <TextField
          required
          fullWidth
          size='small'
          type='password'
          label={t('fields.currentPassword')}
          autoComplete='current-password'
          {...register('currentPassword')}
          error={!!errors.currentPassword}
          helperText={errors.currentPassword?.message}
        />

        <TextField
          required
          fullWidth
          size='small'
          type='password'
          label={t('fields.newPassword')}
          autoComplete='new-password'
          {...register('newPassword')}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
        />

        <TextField
          required
          fullWidth
          size='small'
          type='password'
          label={t('fields.confirmPassword')}
          autoComplete='new-password'
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        {errors.root && <Alert severity='error'>{errors.root.message}</Alert>}

        <Stack direction='row' spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={onDone}>{t('common.buttons.cancel')}</Button>
          <Button
            type='submit'
            variant='contained'
            disableElevation
            disabled={isSubmitting}
          >
            {t('common.buttons.update')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ChangePasswordForm
