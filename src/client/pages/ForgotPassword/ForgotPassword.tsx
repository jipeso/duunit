import { useState } from 'react'
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

import { authClient } from '../../util/authClient'
import { LoginSchema } from '#common/types/users.ts'

const forgotPasswordSchema = LoginSchema.pick({ email: true })

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const ForgotPassword = () => {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async ({ email }) => {
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    })

    if (error) {
      setError('root', { message: t('common.errors.unexpected') })
      return
    }

    setSent(true)
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
          {t('forgotPassword.title')}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          {t('forgotPassword.subtitle')}
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
              id='email'
              label={t('fields.email')}
              autoComplete='email'
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            {sent && (
              <Alert severity='success'>{t('forgotPassword.sent')}</Alert>
            )}
            {errors.root && (
              <Alert severity='error'>{errors.root.message}</Alert>
            )}

            <Button
              type='submit'
              fullWidth
              variant='contained'
              loading={isSubmitting}
              disableElevation
              sx={{ py: 1.5, mt: 2, textTransform: 'none', fontSize: '1rem' }}
            >
              {t('forgotPassword.submit')}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}

export default ForgotPassword
