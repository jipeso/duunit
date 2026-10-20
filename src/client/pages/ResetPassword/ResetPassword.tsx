import { useNavigate, useSearchParams } from 'react-router'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import { useTranslation } from 'react-i18next'

import i18n from '../../util/i18n'
import { authClient } from '../../util/authClient'
import { useNotification } from '../../components/Notification'
import { ChangePasswordSchema } from '#common/types/users.ts'

const resetPasswordSchema = ChangePasswordSchema.pick({ newPassword: true })
  .extend({ confirmPassword: z.string().min(1) })
  .refine(data => data.newPassword === data.confirmPassword, {
    error: () => i18n.t('validation.passwordsDoNotMatch'),
    path: ['confirmPassword'],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const ResetPassword = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { showSuccess } = useNotification()
  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async data => {
    const { error } = await authClient.resetPassword({
      newPassword: data.newPassword,
      token: searchParams.get('token') ?? '',
    })

    if (error) {
      setError('root', {
        message: t(
          error.code === 'INVALID_TOKEN'
            ? 'resetPassword.invalidLink'
            : 'common.errors.unexpected'
        ),
      })
      return
    }

    showSuccess(t('notifications.passwordResetSuccess'))
    void navigate('/login')
  }

  return (
    <Container maxWidth='sm'>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Typography
          component='h1'
          variant='h5'
          color='text.primary'
          gutterBottom
        >
          {t('resetPassword.title')}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          {t('resetPassword.subtitle')}
        </Typography>

        <Box
          component='form'
          onSubmit={event => {
            void handleSubmit(onSubmit)(event)
          }}
          noValidate
          sx={{ width: '100%' }}
        >
          <Stack spacing={3}>
            <TextField
              required
              fullWidth
              id='newPassword'
              label={t('fields.newPassword')}
              type='password'
              autoComplete='new-password'
              {...register('newPassword')}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />

            <TextField
              required
              fullWidth
              id='confirmPassword'
              label={t('fields.confirmPassword')}
              type='password'
              autoComplete='new-password'
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            {errors.root && (
              <Alert severity='error'>{errors.root.message}</Alert>
            )}

            <Button
              type='submit'
              fullWidth
              variant='contained'
              loading={isSubmitting}
              disableElevation
              sx={{
                py: 1.5,
                mt: 2,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {t('resetPassword.submit')}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}

export default ResetPassword
