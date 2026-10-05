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
  MAX_COVER_LETTER_LENGTH,
  MAX_TEXT_LENGTH,
  MAX_NOTES_LENGTH,
  MIN_APPLIED_DATE,
  NewApplicationSchema,
  type NewApplication,
  type NewApplicationInput,
} from '#common/types/applications.ts'
import { parseDate } from '../../util/date'

interface ApplicationFormProps {
  defaultValues: Partial<NewApplicationInput>
  onSubmit: SubmitHandler<NewApplication>
  submitLabel: string
  isPending: boolean
  error: string | null
  returnTo?: string
  requireChanges?: boolean
}

const ApplicationForm = ({
  defaultValues,
  onSubmit,
  submitLabel,
  isPending,
  error,
  returnTo = '/applications',
  requireChanges = false,
}: ApplicationFormProps) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<NewApplicationInput, unknown, NewApplication>({
    resolver: zodResolver(NewApplicationSchema),
    mode: 'onTouched',
    reValidateMode: 'onSubmit',
    defaultValues,
  })

  const [position, company, location, salary, notes, coverLetter] = watch([
    'position',
    'company',
    'location',
    'salary',
    'notes',
    'coverLetter',
  ])

  const counter = (value: string | null | undefined, max: number) =>
    `${String(value?.length ?? 0)}/${String(max)}`

  return (
    <Box
      component='form'
      onSubmit={event => {
        void handleSubmit(onSubmit)(event)
      }}
      noValidate
      sx={{ width: '100%', mb: 5 }}
    >
      <Stack spacing={3}>
        <TextField
          required
          fullWidth
          id='position'
          label={t('fields.position')}
          slotProps={{
            htmlInput: {
              'data-testid': 'application-position',
              maxLength: MAX_TEXT_LENGTH,
            },
          }}
          {...register('position')}
          error={!!errors.position}
          helperText={
            errors.position?.message ?? counter(position, MAX_TEXT_LENGTH)
          }
        />

        <TextField
          required
          fullWidth
          id='company'
          label={t('fields.company')}
          slotProps={{
            htmlInput: {
              'data-testid': 'application-company',
              maxLength: MAX_TEXT_LENGTH,
            },
          }}
          {...register('company')}
          error={!!errors.company}
          helperText={
            errors.company?.message ?? counter(company, MAX_TEXT_LENGTH)
          }
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
              date: parseDate(MIN_APPLIED_DATE).toLocaleDateString(
                i18n.language
              ),
              defaultValue: errors.appliedAt.message,
            })
          }
        />

        <TextField
          fullWidth
          id='deadline'
          type='date'
          label={t('fields.deadline')}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { 'data-testid': 'application-deadline' },
          }}
          {...register('deadline')}
          error={!!errors.deadline}
          helperText={errors.deadline?.message}
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
            htmlInput: {
              'data-testid': 'application-location',
              maxLength: MAX_TEXT_LENGTH,
            },
          }}
          {...register('location')}
          error={!!errors.location}
          helperText={
            errors.location?.message ?? counter(location, MAX_TEXT_LENGTH)
          }
        />

        <TextField
          fullWidth
          id='salary'
          label={t('fields.salary')}
          slotProps={{
            htmlInput: {
              'data-testid': 'application-salary',
              maxLength: MAX_TEXT_LENGTH,
            },
          }}
          {...register('salary')}
          error={!!errors.salary}
          helperText={
            errors.salary?.message ?? counter(salary, MAX_TEXT_LENGTH)
          }
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          id='notes'
          label={t('fields.notes')}
          slotProps={{
            htmlInput: {
              'data-testid': 'application-notes',
              maxLength: MAX_NOTES_LENGTH,
              style: { resize: 'vertical', maxHeight: '40vh' },
            },
          }}
          {...register('notes')}
          error={!!errors.notes}
          helperText={errors.notes?.message ?? counter(notes, MAX_NOTES_LENGTH)}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          id='coverLetter'
          label={t('fields.coverLetter')}
          slotProps={{
            htmlInput: {
              'data-testid': 'application-cover-letter',
              maxLength: MAX_COVER_LETTER_LENGTH,
              style: { resize: 'vertical', maxHeight: '40vh' },
            },
          }}
          {...register('coverLetter')}
          error={!!errors.coverLetter}
          helperText={
            errors.coverLetter?.message ??
            counter(coverLetter, MAX_COVER_LETTER_LENGTH)
          }
        />

        {error && (
          <Alert severity='error' sx={{ borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Button
          type='submit'
          data-testid='application-submit'
          fullWidth
          variant='contained'
          disabled={isPending || (requireChanges && !isDirty)}
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
            void navigate(returnTo)
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
