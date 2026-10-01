import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import {
  APPLICATION_STATUSES,
  MIN_APPLIED_DATE,
  NewApplicationSchema,
  type NewApplication,
  type NewApplicationInput,
} from '#common/types/applications.ts'

interface ApplicationFormProps {
  defaultValues: Partial<NewApplicationInput>
  onSubmit: SubmitHandler<NewApplication>
  submitLabel: string
  isPending: boolean
  error: string | null
}

const ApplicationForm = ({
  defaultValues,
  onSubmit,
  submitLabel,
  isPending,
  error,
}: ApplicationFormProps) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewApplicationInput, unknown, NewApplication>({
    resolver: zodResolver(NewApplicationSchema),
    mode: 'onTouched',
    reValidateMode: 'onSubmit',
    defaultValues,
  })

  return (
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
              date: new Date(MIN_APPLIED_DATE + 'T00:00:00').toLocaleDateString(
                i18n.language
              ),
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

        {error && (
          <Alert severity='error' sx={{ borderRadius: 1 }}>
            {t(error)}
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
            submitLabel
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
  )
}

export default ApplicationForm
