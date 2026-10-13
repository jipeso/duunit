import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import type { NewApplicationInput } from '#common/types/applications.ts'
import {
  AnalyzeDescriptionSchema,
  MAX_DESCRIPTION_LENGTH,
  type AnalyzeDescription,
  type DescriptionAnalysis,
} from '#common/types/jobAnalysis.ts'
import useAnalyzeDescription from '../../hooks/useAnalyzeDescription'
import { EMPTY_VALUE } from '../../util/applications'
import { parseDate } from '../../util/date'

const toNotes = (title: string, items: string[]) =>
  [`${title}:`, ...items.map(item => `- ${item}`)].join('\n')

const toList = (items: string[]) =>
  items.length > 0 ? (
    <Box component='ul' sx={{ m: 0, pl: 2.5 }}>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </Box>
  ) : null

const JobAnalysis = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const {
    mutate: analyzeDescription,
    data,
    isPending,
    isError,
    cancel,
  } = useAnalyzeDescription()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AnalyzeDescription>({
    resolver: zodResolver(AnalyzeDescriptionSchema),
    mode: 'onTouched',
    reValidateMode: 'onSubmit',
    defaultValues: { description: '' },
  })

  const description = watch('description')

  const onSubmit: SubmitHandler<AnalyzeDescription> = values => {
    analyzeDescription(values)
  }

  const createApplication = (analysis: DescriptionAnalysis) => {
    const defaultValues: Partial<NewApplicationInput> = {
      position: analysis.position,
      company: analysis.company,
      location: analysis.location ?? '',
      salary: analysis.salary ?? '',
      deadline: analysis.deadline ?? '',
      notes: [
        toNotes(t('jobAnalysis.tasks'), analysis.tasks),
        toNotes(t('jobAnalysis.requirements'), analysis.requirements),
      ].join('\n\n'),
    }

    void navigate('/applications/new', {
      state: { defaultValues, returnTo: '/job-analysis' },
    })
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 4, mb: 8 }}>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Typography
          component='h1'
          variant='h5'
          color='text.primary'
          gutterBottom
        >
          {t('jobAnalysis.title')}
        </Typography>

        <Typography variant='body2' color='text.secondary'>
          {t('jobAnalysis.subtitle')}
        </Typography>

        <Typography variant='caption' color='text.secondary'>
          {t('jobAnalysis.disclaimer')}
        </Typography>
      </Stack>

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
              `${String(description.length)}/${String(MAX_DESCRIPTION_LENGTH)}`
            }
          />

          {isError && (
            <Alert severity='error' sx={{ borderRadius: 1 }}>
              {t('common.errors.unexpected')}
            </Alert>
          )}

          <Button
            type={isPending ? 'button' : 'submit'}
            data-testid='job-analysis-analyze'
            fullWidth
            variant={isPending ? 'outlined' : 'contained'}
            onClick={isPending ? cancel : undefined}
            startIcon={
              isPending && <CircularProgress size={18} color='inherit' />
            }
            disableElevation
            sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem' }}
          >
            {isPending ? t('common.buttons.cancel') : t('jobAnalysis.analyze')}
          </Button>
        </Stack>
      </Box>

      {data && (
        <Stack spacing={2}>
          <Paper
            variant='outlined'
            data-testid='job-analysis-result'
            sx={{ p: 2 }}
          >
            <Stack component='dl' spacing={2} sx={{ m: 0 }}>
              {[
                { label: t('fields.position'), value: data.position },
                { label: t('fields.company'), value: data.company },
                { label: t('fields.location'), value: data.location },
                { label: t('fields.salary'), value: data.salary },
                {
                  label: t('fields.deadline'),
                  value:
                    data.deadline &&
                    parseDate(data.deadline).toLocaleDateString(i18n.language),
                },
                { label: t('jobAnalysis.tasks'), value: toList(data.tasks) },
                {
                  label: t('jobAnalysis.requirements'),
                  value: toList(data.requirements),
                },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Typography
                    component='dt'
                    variant='body2'
                    color='text.secondary'
                  >
                    {label}
                  </Typography>
                  <Typography
                    component='dd'
                    sx={{ m: 0, overflowWrap: 'anywhere' }}
                  >
                    {value ?? EMPTY_VALUE}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Button
            data-testid='job-analysis-create-application'
            fullWidth
            variant='contained'
            onClick={() => {
              createApplication(data)
            }}
            disableElevation
            sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem' }}
          >
            {t('jobAnalysis.createApplication')}
          </Button>
        </Stack>
      )}
    </Container>
  )
}

export default JobAnalysis
