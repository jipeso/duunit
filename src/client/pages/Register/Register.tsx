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

import {
  NewUserSchema,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '#common/types/users.ts'
import useSaveUser from '../../hooks/useSaveUser'

const registerSchema = NewUserSchema.extend({
  confirmPassword: z
    .string()
    .min(1, { message: 'register.errors.confirmPasswordRequired' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'register.errors.passwordsDoNotMatch',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { mutateAsync: saveUser, isPending } = useSaveUser()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const onSubmit: SubmitHandler<RegisterFormData> = async data => {
    setGlobalError(null)
    const { name, email, password } = data

    try {
      await saveUser({ name, email, password })
      reset()
      void navigate('/login')
    } catch (error) {
      setGlobalError(
        axios.isAxiosError(error) && error.response?.status === 409
          ? 'register.errors.emailInUse'
          : 'register.errors.unexpectedError'
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
              label={t('common.name')}
              {...register('name')}
              error={!!errors.name}
              helperText={
                errors.name?.message
                  ? t(errors.name.message, {
                      count:
                        errors.name.message === 'validation.name.tooShort'
                          ? NAME_MIN_LENGTH
                          : NAME_MAX_LENGTH,
                    })
                  : undefined
              }
            />

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
              autoComplete='new-password'
              {...register('password')}
              error={!!errors.password}
              helperText={
                errors.password?.message
                  ? t(errors.password.message, {
                      count:
                        errors.password.message ===
                        'validation.password.tooShort'
                          ? PASSWORD_MIN_LENGTH
                          : PASSWORD_MAX_LENGTH,
                    })
                  : undefined
              }
            />

            <TextField
              required
              fullWidth
              id='confirmPassword'
              label={t('common.confirmPassword')}
              type='password'
              autoComplete='new-password'
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={
                errors.confirmPassword?.message
                  ? t(errors.confirmPassword.message)
                  : undefined
              }
            />

            {globalError && (
              <Alert severity='error' sx={{ borderRadius: 1 }}>
                {t(globalError)}
              </Alert>
            )}

            <Button
              type='submit'
              fullWidth
              variant='contained'
              disabled={isPending}
              disableElevation
              sx={{ py: 1.5, mt: 2, textTransform: 'none', fontSize: '1rem' }}
            >
              {isPending ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                t('common.register')
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
                {t('common.login')}
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}

export default RegisterForm
