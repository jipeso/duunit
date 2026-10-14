import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import type { NewApplicationInput } from '#common/types/applications.ts'
import {
  AnalyzeDescriptionSchema,
  MAX_ANALYSES_PER_DAY,
  MAX_DESCRIPTION_LENGTH,
  type AnalyzeDescription,
} from '#common/types/jobAnalysis.ts'
import useAnalyzeDescription from '../../hooks/useAnalyzeDescription'
import {
  isTooManyRequestsError,
  isUnprocessableError,
} from '../../util/apiClient'
import { EMPTY_VALUE } from '../../util/applications'
import { parseDate } from '../../util/date'

const bullets = (items: string[]) => items.map(item => `- ${item}`).join('\n')

const JobAnalysis = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { mutate: analyze, data, isPending, error } = useAnalyzeDescription()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AnalyzeDescription>({
    resolver: zodResolver(AnalyzeDescriptionSchema),
    defaultValues: { description: '' },
  })

  const descriptionLength = watch('description').length

  const submit = handleSubmit(values => {
    analyze(values)
  })

  const fields = [
    [t('fields.position'), data?.position],
    [t('fields.company'), data?.company],
    [t('fields.location'), data?.location],
    [t('fields.salary'), data?.salary],
    [
      t('fields.deadline'),
      data?.deadline &&
        parseDate(data.deadline).toLocaleDateString(i18n.language),
    ],
    [t('jobAnalysis.tasks'), data && bullets(data.tasks)],
    [t('jobAnalysis.requirements'), data && bullets(data.requirements)],
  ]

  return (
    <Container maxWidth='sm' sx={{ mt: 4, mb: 8 }}>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Typography component='h1' variant='h5'>
          {t('jobAnalysis.title')}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('jobAnalysis.subtitle')}
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          {t('jobAnalysis.disclaimer')}
        </Typography>
      </Stack>

      <Stack
        component='form'
        onSubmit={e => void submit(e)}
        noValidate
        spacing={3}
        sx={{ mb: 5 }}
      >
        <TextField
          required
          fullWidth
          multiline
          rows={8}
          id='description'
          label={t('fields.description')}
          slotProps={{
            htmlInput: {
              'data-testid': 'job-analysis-description',
              maxLength: MAX_DESCRIPTION_LENGTH,
              style: { resize: 'vertical', maxHeight: '40vh' },
            },
          }}
          {...register('description')}
          error={!!errors.description}
          helperText={
            errors.description?.message ??
            `${String(descriptionLength)}/${String(MAX_DESCRIPTION_LENGTH)}`
          }
        />

        {error && (
          <Alert severity='error'>
            {isTooManyRequestsError(error)
              ? t('jobAnalysis.limitReached', { count: MAX_ANALYSES_PER_DAY })
              : t(
                  isUnprocessableError(error)
                    ? 'jobAnalysis.notJobDescription'
                    : 'common.errors.unexpected'
                )}
          </Alert>
        )}

        <Button
          type='submit'
          data-testid='job-analysis-analyze'
          fullWidth
          variant='contained'
          loading={isPending}
          disableElevation
          sx={{ py: 1 }}
        >
          {t('jobAnalysis.analyze')}
        </Button>
      </Stack>

      {(isPending || data) && (
        <Paper
          variant='outlined'
          data-testid='job-analysis-result'
          sx={{ p: 2, mb: 2 }}
        >
          <Stack component='dl' spacing={2} sx={{ m: 0 }}>
            {fields.map(([label, value]) => (
              <div key={label}>
                <Typography
                  component='dt'
                  variant='body2'
                  color='text.secondary'
                >
                  {label}
                </Typography>
                <Typography
                  component='dd'
                  sx={{
                    m: 0,
                    whiteSpace: 'pre-line',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {isPending ? (
                    <Skeleton />
                  ) : value?.length ? (
                    value
                  ) : (
                    EMPTY_VALUE
                  )}
                </Typography>
              </div>
            ))}
          </Stack>
        </Paper>
      )}

      {data && (
        <Button
          data-testid='job-analysis-create-application'
          fullWidth
          variant='contained'
          onClick={() => {
            const defaultValues: Partial<NewApplicationInput> = {
              position: data.position,
              company: data.company,
              location: data.location ?? '',
              salary: data.salary ?? '',
              deadline: data.deadline ?? '',
              notes: [
                `${t('jobAnalysis.tasks')}:`,
                bullets(data.tasks),
                '',
                `${t('jobAnalysis.requirements')}:`,
                bullets(data.requirements),
              ].join('\n'),
            }
            void navigate('/applications/new', {
              state: { defaultValues, returnTo: '/job-analysis' },
            })
          }}
          disableElevation
          sx={{ py: 1 }}
        >
          {t('jobAnalysis.createApplication')}
        </Button>
      )}
    </Container>
  )
}

export default JobAnalysis
