import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import {
  APPLICATION_STATUSES,
  MIN_APPLIED_DATE,
  NewApplicationSchema,
  type NewApplication as NewApplicationPayload,
  type NewApplicationInput,
} from '#common/types/applications.ts'
import useSaveApplication from '../../hooks/useSaveApplication'
import { useNotification } from '../../components/Notification'

const NewApplication = () => {
  const { t, i18n } = useTranslation()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { mutateAsync: saveApplication, isPending } = useSaveApplication()
  const { showSuccess } = useNotification()
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewApplicationInput, unknown, NewApplicationPayload>({
    resolver: zodResolver(NewApplicationSchema),
    mode: 'onTouched',
    reValidateMode: 'onSubmit',
    defaultValues: { status: 'applied' },
  })

  const onSubmit: SubmitHandler<NewApplicationPayload> = async data => {
    setGlobalError(null)

    try {
      await saveApplication(data)
      showSuccess(t('notifications.applicationCreatedSuccess'))
      void navigate('/applications')
    } catch {
      setGlobalError('common.errors.unexpected')
    }
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Typography
          component='h1'
          variant='h5'
          color='text.primary'
          gutterBottom
        >
          {t('applications.new')}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          {t('applications.newSubtitle')}
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
              id='company'
              label={t('fields.company')}
              slotProps={{
                htmlInput: { 'data-testid': 'application-company' },
              }}
              {...register('company')}
              error={!!errors.company}
              helperText={errors.company?.message}
            />

            <TextField
              required
              fullWidth
              id='position'
              label={t('fields.position')}
              slotProps={{
                htmlInput: { 'data-testid': 'application-position' },
              }}
              {...register('position')}
              error={!!errors.position}
              helperText={errors.position?.message}
            />

            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  required
                  fullWidth
                  id='status'
                  label={t('fields.status')}
                  slotProps={{
                    htmlInput: { 'data-testid': 'application-status' },
                  }}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  {APPLICATION_STATUSES.map(status => (
                    <MenuItem key={status} value={status}>
                      {t(`applications.statuses.${status}`)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <TextField
              fullWidth
              id='appliedAt'
              type='date'
              label={t('fields.appliedAt')}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { 'data-testid': 'application-applied-at' },
              }}
              {...register('appliedAt')}
              error={!!errors.appliedAt}
              helperText={
                errors.appliedAt?.message &&
                t(errors.appliedAt.message, {
                  field: t('fields.appliedAt'),
                  date: new Date(
                    MIN_APPLIED_DATE + 'T00:00:00'
                  ).toLocaleDateString(i18n.language),
                  defaultValue: errors.appliedAt.message,
                })
              }
            />

            <TextField
              fullWidth
              id='jobPostingUrl'
              label={t('fields.jobPostingUrl')}
              slotProps={{
                htmlInput: { 'data-testid': 'application-job-posting-url' },
              }}
              {...register('jobPostingUrl')}
              error={!!errors.jobPostingUrl}
              helperText={errors.jobPostingUrl?.message}
            />

            <TextField
              fullWidth
              id='location'
              label={t('fields.location')}
              slotProps={{
                htmlInput: { 'data-testid': 'application-location' },
              }}
              {...register('location')}
              error={!!errors.location}
              helperText={errors.location?.message}
            />

            {globalError && (
              <Alert severity='error' sx={{ borderRadius: 1 }}>
                {t(globalError)}
              </Alert>
            )}

            <Button
              type='submit'
              data-testid='application-submit'
              fullWidth
              variant='contained'
              disabled={isPending}
              disableElevation
              sx={{ py: 1.5, mt: 2, textTransform: 'none', fontSize: '1rem' }}
            >
              {isPending ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                t('applications.new')
              )}
            </Button>

            <Button
              type='button'
              data-testid='application-cancel'
              fullWidth
              variant='text'
              onClick={() => {
                void navigate('/applications')
              }}
              sx={{ textTransform: 'none', fontSize: '1rem' }}
            >
              {t('common.buttons.cancel')}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}

export default NewApplication
