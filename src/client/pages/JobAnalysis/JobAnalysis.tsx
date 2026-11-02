import type { ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
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
import useAnalysisUsage from '../../hooks/useAnalysisUsage'
import useAnalyzeDescription from '../../hooks/useAnalyzeDescription'
import useLastAnalysis, {
  lastAnalysisQueryKey,
} from '../../hooks/useLastAnalysis'
import {
  isTooManyRequestsError,
  isUnprocessableError,
} from '../../util/apiClient'
import { EMPTY_VALUE } from '../../util/applications'
import { parseDate } from '../../util/date'

const bullets = (items: string[]) => items.map(item => `- ${item}`).join('\n')

const Detail = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => (
  <Box>
    <Typography component='dt' variant='body2' color='text.secondary'>
      {label}
    </Typography>
    <Typography component='dd' sx={{ m: 0, overflowWrap: 'anywhere' }}>
      {children}
    </Typography>
  </Box>
)

const ListSection = ({
  title,
  items,
}: {
  title: string
  items: string[] | undefined
}) => (
  <Box>
    <Typography component='h3' variant='subtitle1' sx={{ mb: 0.5 }}>
      {title}
    </Typography>
    {!items ? (
      <>
        <Skeleton />
        <Skeleton />
        <Skeleton width='60%' />
      </>
    ) : items.length ? (
      <Box component='ul' sx={{ m: 0, pl: 2.5, overflowWrap: 'anywhere' }}>
        {items.map(item => (
          <Typography component='li' key={item} sx={{ mb: 0.5 }}>
            {item}
          </Typography>
        ))}
      </Box>
    ) : (
      <Typography color='text.secondary'>{EMPTY_VALUE}</Typography>
    )}
  </Box>
)

const JobAnalysis = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const {
    mutate: analyze,
    reset: resetAnalysis,
    isPending,
    error,
  } = useAnalyzeDescription()
  const queryClient = useQueryClient()
  const { data: lastAnalysis } = useLastAnalysis()
  const data = lastAnalysis?.result
  const { data: usage } = useAnalysisUsage()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<AnalyzeDescription>({
    resolver: zodResolver(AnalyzeDescriptionSchema),
    defaultValues: { description: lastAnalysis?.description ?? '' },
  })

  const description = watch('description')
  const alreadyAnalyzed = lastAnalysis?.description === description
  const limitReached = usage?.remaining === 0

  const submit = handleSubmit(values => {
    analyze(values)
  })

  const details = [
    [t('fields.location'), data?.location],
    [t('fields.salary'), data?.salary],
    [
      t('fields.deadline'),
      data?.deadline &&
        parseDate(data.deadline).toLocaleDateString(i18n.language),
    ],
  ] as const

  const createApplication = () => {
    if (!data) return
    const defaultValues: Partial<NewApplicationInput> = {
      position: data.position,
      company: data.company,
      status: 'saved',
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
  }

  return (
    <Container maxWidth='sm'>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Typography component='h1' variant='h5'>
          {t('jobAnalysis.title')}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('jobAnalysis.subtitle')}
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
            `${String(description.length)}/${String(MAX_DESCRIPTION_LENGTH)}`
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

        <Stack
          direction={{ xs: 'column-reverse', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { sm: 'center' } }}
        >
          <Typography
            variant='caption'
            color={limitReached ? 'error' : 'text.secondary'}
            data-testid='job-analysis-remaining'
            sx={{ flexGrow: 1 }}
          >
            {usage &&
              t('jobAnalysis.remaining', {
                count: usage.remaining,
                limit: MAX_ANALYSES_PER_DAY,
              })}
          </Typography>
          <Button
            data-testid='job-analysis-clear'
            disabled={(!description && !lastAnalysis) || isPending}
            onClick={() => {
              reset({ description: '' })
              resetAnalysis()
              queryClient.setQueryData(lastAnalysisQueryKey, null)
              setFocus('description')
            }}
          >
            {t('common.buttons.clear')}
          </Button>
          <Button
            type='submit'
            data-testid='job-analysis-analyze'
            variant='contained'
            loading={isPending}
            disabled={alreadyAnalyzed || limitReached}
            sx={{ py: 1, px: 4 }}
          >
            {t('jobAnalysis.analyze')}
          </Button>
        </Stack>
      </Stack>

      {(isPending || data) && (
        <Paper
          variant='outlined'
          data-testid='job-analysis-result'
          sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}
        >
          <Stack spacing={3}>
            <Box sx={{ overflowWrap: 'anywhere' }}>
              <Typography component='h2' variant='h6'>
                {isPending ? <Skeleton width='70%' /> : data?.position}
              </Typography>
              <Typography color='text.secondary'>
                {isPending ? <Skeleton width='40%' /> : data?.company}
              </Typography>
            </Box>

            <Box
              component='dl'
              sx={{
                m: 0,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                columnGap: 3,
                rowGap: 1.5,
              }}
            >
              {details.map(([label, value]) => (
                <Detail key={label} label={label}>
                  {isPending ? (
                    <Skeleton />
                  ) : value?.length ? (
                    value
                  ) : (
                    EMPTY_VALUE
                  )}
                </Detail>
              ))}
            </Box>

            <Divider />

            <ListSection
              title={t('jobAnalysis.tasks')}
              items={isPending ? undefined : data?.tasks}
            />
            <ListSection
              title={t('jobAnalysis.requirements')}
              items={isPending ? undefined : data?.requirements}
            />

            <Divider />

            <Stack
              direction={{ xs: 'column-reverse', sm: 'row' }}
              spacing={2}
              sx={{ alignItems: { sm: 'center' } }}
            >
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ flexGrow: 1 }}
              >
                {t('jobAnalysis.disclaimer')}
              </Typography>
              <Button
                data-testid='job-analysis-create-application'
                variant='contained'
                disabled={!data || isPending}
                onClick={createApplication}
                sx={{ py: 1, flexShrink: 0 }}
              >
                {t('jobAnalysis.createApplication')}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Container>
  )
}

export default JobAnalysis
