import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import {
  MIN_STATUS_DATE,
  NewApplicationSchema,
  statusRank,
  type NewApplication,
  type NewApplicationInput,
} from '#common/types/applications.ts'
import { MAX_TEXT_LENGTH, MAX_LONG_TEXT_LENGTH } from '#common/types/common.ts'
import { parseDate, today } from '../../util/date'
import useResumes from '../../hooks/useResumes'
import StatusMenuItems from '../StatusMenuItems'

const formSchema = NewApplicationSchema.refine(
  ({ appliedOn }) => !appliedOn || appliedOn <= today(),
  { path: ['appliedOn'], error: 'validation.inFuture' }
)

interface ApplicationFormProps {
  defaultValues: Partial<NewApplicationInput>
  onSubmit: (
    values: NewApplication,
    changes: Partial<NewApplication>
  ) => void | Promise<void>
  submitLabel: string
  isPending: boolean
  error: string | null
  returnTo?: string
  requireChanges?: boolean
  showAppliedOn?: boolean
}

const ApplicationForm = ({
  defaultValues,
  onSubmit,
  submitLabel,
  isPending,
  error,
  returnTo = '/applications',
  requireChanges = false,
  showAppliedOn = false,
}: ApplicationFormProps) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { data: resumes = [] } = useResumes()

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<NewApplicationInput, unknown, NewApplication>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    reValidateMode: 'onSubmit',
    defaultValues,
  })

  const [status, position, company, location, salary, notes, coverLetter] =
    watch([
      'status',
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
        void handleSubmit(values =>
          onSubmit(
            values,
            Object.fromEntries(
              Object.entries(values).filter(([field]) => field in dirtyFields)
            )
          )
        )(event)
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
              {StatusMenuItems(t)}
            </TextField>
          )}
        />

        {showAppliedOn && (
          <TextField
            fullWidth
            id='appliedOn'
            type='date'
            label={t('fields.appliedOn')}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: {
                max: today(),
                'data-testid': 'application-applied-on',
              },
            }}
            {...register('appliedOn', { disabled: status === 'saved' })}
            error={!!errors.appliedOn}
            helperText={
              errors.appliedOn?.message &&
              t(errors.appliedOn.message, {
                field: t('fields.appliedOn'),
                date: parseDate(MIN_STATUS_DATE).toLocaleDateString(
                  i18n.language
                ),
                defaultValue: errors.appliedOn.message,
              })
            }
          />
        )}

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
          id='nextInterviewAt'
          type='datetime-local'
          label={t('fields.nextInterviewAt')}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { 'data-testid': 'application-next-interview-at' },
          }}
          {...register('nextInterviewAt', {
            disabled: statusRank(status) > statusRank('interviewing'),
          })}
          error={!!errors.nextInterviewAt}
          helperText={errors.nextInterviewAt?.message}
        />

        <Controller
          name='resumeId'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              select
              fullWidth
              id='resumeId'
              label={t('fields.resume')}
              slotProps={{
                htmlInput: { 'data-testid': 'application-resume' },
                select: {
                  MenuProps: {
                    slotProps: {
                      paper: { sx: { maxHeight: 320, maxWidth: 400 } },
                    },
                  },
                },
              }}
              error={!!errors.resumeId}
              helperText={errors.resumeId?.message}
            >
              <MenuItem value=''>{t('resumes.none')}</MenuItem>
              {resumes.map(resume => (
                <MenuItem key={resume.id} value={resume.id}>
                  <Typography noWrap>{resume.fileName}</Typography>
                </MenuItem>
              ))}
            </TextField>
          )}
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
              maxLength: MAX_LONG_TEXT_LENGTH,
              style: { resize: 'vertical', maxHeight: '40vh' },
            },
          }}
          {...register('notes')}
          error={!!errors.notes}
          helperText={
            errors.notes?.message ?? counter(notes, MAX_LONG_TEXT_LENGTH)
          }
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
              maxLength: MAX_LONG_TEXT_LENGTH,
              style: { resize: 'vertical', maxHeight: '40vh' },
            },
          }}
          {...register('coverLetter')}
          error={!!errors.coverLetter}
          helperText={
            errors.coverLetter?.message ??
            counter(coverLetter, MAX_LONG_TEXT_LENGTH)
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
          sx={{ py: 1.5, mt: 2, fontSize: '1rem' }}
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
          sx={{ py: 1.5, fontSize: '1rem' }}
        >
          {t('common.buttons.cancel')}
        </Button>
      </Stack>
    </Box>
  )
}

export default ApplicationForm
