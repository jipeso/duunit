import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Link from '@mui/material/Link'
import { useTranslation } from 'react-i18next'

import useAuth from '../../hooks/useAuth'
import { useNotification } from '../../components/Notification'
import { LoginSchema, type LoginCredentials } from '#common/types/users.ts'

export const LoginForm: React.FC = () => {
  const { t } = useTranslation()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { login, isLoggingIn } = useAuth()
  const { showSuccess } = useNotification()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(LoginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const onSubmit: SubmitHandler<LoginCredentials> = async data => {
    setGlobalError(null)

    try {
      await login(data)
      showSuccess(t('notifications.loginSuccess'))
      void navigate('/')
    } catch {
      setGlobalError(t('login.errors.invalidCredentials'))
    }
  }

  return (
    <Container maxWidth='xs' sx={{ mt: 8 }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Typography
          component='h1'
          variant='h5'
          color='text.primary'
          gutterBottom
        >
          {t('login.title')}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          {t('login.subtitle')}
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
              label={t('common.email')}
              autoComplete='email'
              {...register('email')}
              error={!!errors.email}
              helperText={
                errors.email?.message ? t(errors.email.message) : undefined
              }
            />

            <TextField
              required
              fullWidth
              id='password'
              label={t('common.password')}
              type='password'
              autoComplete='current-password'
              {...register('password')}
              error={!!errors.password}
              helperText={
                errors.password?.message
                  ? t(errors.password.message)
                  : undefined
              }
            />

            {globalError && (
              <Alert severity='error' sx={{ borderRadius: 1 }}>
                {globalError}
              </Alert>
            )}

            <Button
              type='submit'
              fullWidth
              variant='contained'
              disabled={isLoggingIn}
              disableElevation
              sx={{ py: 1.5, mt: 2, textTransform: 'none', fontSize: '1rem' }}
            >
              {isLoggingIn ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                t('common.login')
              )}
            </Button>

            <Typography variant='body2' sx={{ textAlign: 'center' }}>
              {t('login.doNotHaveAccount')}
              <Link
                component='a'
                href='/register'
                underline='hover'
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              >
                {' '}
                {t('common.register')}
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}

export default LoginForm
