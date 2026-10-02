import { useState, type ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate, useParams } from 'react-router'

import type { ApplicationResponse } from '#common/types/applications.ts'
import useApplications from '../../hooks/useApplications'
import DeleteApplicationDialog from '../../components/DeleteApplicationDialog'
import { useNotification } from '../../components/Notification'
import { EMPTY_VALUE, statusColors } from '../../util/applications'
import { parseDate } from '../../util/date'

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

const ApplicationDetails = ({
  application,
}: {
  application: ApplicationResponse
}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { showSuccess } = useNotification()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const {
    position,
    company,
    status,
    appliedAt,
    location,
    jobPostingUrl,
    coverLetter,
  } = application

  const copyCoverLetter = async () => {
    if (coverLetter) {
      await navigator.clipboard.writeText(coverLetter)
      showSuccess(t('notifications.coverLetterCopied'))
    }
  }

  return (
    <Stack spacing={4}>
      <Box>
        <Typography component='h1' variant='h5'>
          {position}
        </Typography>
        <Typography color='text.secondary' sx={{ mb: 1.5 }}>
          {company}
        </Typography>
        <Chip
          size='small'
          variant='outlined'
          color={statusColors[status]}
          label={t(`applications.statuses.${status}`)}
        />
      </Box>

      <Stack component='dl' spacing={1.5} sx={{ m: 0 }}>
        <Detail label={t('fields.appliedAt')}>
          {appliedAt
            ? parseDate(appliedAt).toLocaleDateString(i18n.language)
            : EMPTY_VALUE}
        </Detail>
        <Detail label={t('fields.location')}>{location ?? EMPTY_VALUE}</Detail>
        <Detail label={t('fields.jobPostingUrl')}>
          {jobPostingUrl ? (
            <Link
              href={jobPostingUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              {t('applications.openJobPosting')}
            </Link>
          ) : (
            EMPTY_VALUE
          )}
        </Detail>
      </Stack>

      <Box>
        <Stack direction='row' sx={{ alignItems: 'center', mb: 1 }}>
          <Typography component='h2' variant='h6' sx={{ flexGrow: 1 }}>
            {t('fields.coverLetter')}
          </Typography>
          {coverLetter && (
            <Tooltip title={t('common.buttons.copyToClipboard')}>
              <IconButton
                size='small'
                aria-label={t('common.buttons.copyToClipboard')}
                onClick={() => {
                  void copyCoverLetter()
                }}
              >
                <ContentCopyIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
        {coverLetter ? (
          <Paper
            variant='outlined'
            data-testid='application-details-cover-letter'
            sx={{ p: 2, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
          >
            {coverLetter}
          </Paper>
        ) : (
          <Typography variant='body2' color='text.secondary'>
            {t('applications.noCoverLetter')}
          </Typography>
        )}
      </Box>

      <Stack direction='row' spacing={1}>
        <Button
          component={RouterLink}
          to='/applications'
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 'auto' }}
        >
          {t('applications.backToList')}
        </Button>
        <Button
          component={RouterLink}
          to={`/applications/${application.id}/edit`}
          state={{ returnTo: `/applications/${application.id}` }}
          variant='outlined'
          data-testid='application-details-edit'
        >
          {t('common.buttons.edit')}
        </Button>
        <Button
          color='error'
          data-testid='application-details-delete'
          onClick={() => {
            setIsDeleteDialogOpen(true)
          }}
        >
          {t('common.buttons.delete')}
        </Button>
      </Stack>

      <DeleteApplicationDialog
        application={application}
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
        }}
        onDeleted={() => {
          void navigate('/applications')
        }}
      />
    </Stack>
  )
}

const Application = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { data: applications, isPending, isError } = useApplications()

  if (isPending) {
    return <CircularProgress />
  }

  const application = applications?.find(app => app.id === id)

  return (
    <Container maxWidth='sm' sx={{ mt: 4, mb: 8 }}>
      {application ? (
        <ApplicationDetails key={application.id} application={application} />
      ) : (
        <Alert
          severity={isError ? 'error' : 'warning'}
          sx={{ borderRadius: 1 }}
        >
          {t(isError ? 'common.errors.loadFailed' : 'applications.notFound')}
        </Alert>
      )}
    </Container>
  )
}

export default Application
