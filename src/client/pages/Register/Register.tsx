import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
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

import i18n from '../../util/i18n'
import { NewUserSchema } from '#common/types/users.ts'
import useSaveUser from '../../hooks/useSaveUser'
import { useNotification } from '../../components/Notification'

const registerSchema = NewUserSchema.extend({
  confirmPassword: z.string().min(1),
}).refine(data => data.password === data.confirmPassword, {
  error: () => i18n.t('validation.passwordsDoNotMatch'),
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { mutateAsync: saveUser, isPending } = useSaveUser()
  const { showSuccess } = useNotification()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    reValidateMode: 'onSubmit',
  })

  const onSubmit: SubmitHandler<RegisterFormData> = async data => {
    setGlobalError(null)
    const { name, email, password } = data

    try {
      await saveUser({ name, email, password })
      showSuccess(t('notifications.registerSuccess'))
      reset()
      void navigate('/login')
    } catch (error) {
      setGlobalError(
        axios.isAxiosError(error) && error.response?.status === 409
          ? 'register.errors.emailInUse'
          : 'common.errors.unexpected'
      )
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
          {t('register.title')}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          {t('register.subtitle')}
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
              id='name'
              label={t('fields.name')}
              slotProps={{ htmlInput: { 'data-testid': 'register-name' } }}
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              required
              fullWidth
              id='email'
              label={t('fields.email')}
              autoComplete='email'
              slotProps={{ htmlInput: { 'data-testid': 'register-email' } }}
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              required
              fullWidth
              id='password'
              label={t('fields.password')}
              type='password'
              autoComplete='new-password'
              slotProps={{ htmlInput: { 'data-testid': 'register-password' } }}
              {...register('password')}
              error={!!errors.password}
              helperText={
                errors.password?.message &&
                t(errors.password.message, {
                  defaultValue: errors.password.message,
                })
              }
            />

            <TextField
              required
              fullWidth
              id='confirmPassword'
              label={t('fields.confirmPassword')}
              type='password'
              autoComplete='new-password'
              slotProps={{
                htmlInput: { 'data-testid': 'register-confirm-password' },
              }}
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            {globalError && (
              <Alert severity='error' sx={{ borderRadius: 1 }}>
                {t(globalError)}
              </Alert>
            )}

            <Button
              type='submit'
              data-testid='register-submit'
              fullWidth
              variant='contained'
              disabled={isPending}
              disableElevation
              sx={{ py: 1.5, mt: 2, textTransform: 'none', fontSize: '1rem' }}
            >
              {isPending ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                t('navigation.register')
              )}
            </Button>

            <Typography variant='body2' sx={{ mt: 2, textAlign: 'center' }}>
              {t('register.alreadyHaveAccount')}
              <Link
                component='a'
                href='/login'
                underline='hover'
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              >
                {' '}
                {t('navigation.login')}
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}

export default RegisterForm
