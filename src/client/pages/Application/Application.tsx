import { useRef, useState, type ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate, useParams } from 'react-router'

import {
  APPLICATION_STATUSES,
  type ApplicationResponse,
  type ApplicationStatus,
} from '#common/types/applications.ts'
import useApplications from '../../hooks/useApplications'
import useUpdateApplication from '../../hooks/useUpdateApplication'
import useResumes from '../../hooks/useResumes'
import DeleteApplicationDialog from '../../components/DeleteApplicationDialog'
import { useNotification } from '../../components/Notification'
import { EMPTY_VALUE, statusColors } from '../../util/applications'
import { resumeFileUrl } from '../../util/resumes'
import { DATE_TIME_FORMAT, parseDate } from '../../util/date'
import StatusTimeline from './StatusTimeline'

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

const TextSection = ({
  title,
  text,
  emptyText,
  action,
  testId,
}: {
  title: string
  text: string | null
  emptyText: string
  action?: ReactNode
  testId: string
}) => (
  <Box>
    <Stack direction='row' sx={{ alignItems: 'center', mb: 1 }}>
      <Typography component='h2' variant='h6' sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
      {text && action}
    </Stack>
    {text ? (
      <Paper
        variant='outlined'
        data-testid={testId}
        sx={{ p: 2, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
      >
        {text}
      </Paper>
    ) : (
      <Typography variant='body2' color='text.secondary'>
        {emptyText}
      </Typography>
    )}
  </Box>
)

const ApplicationDetails = ({
  application,
}: {
  application: ApplicationResponse
}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotification()
  const { mutate: updateApplication } = useUpdateApplication()
  const { data: resumes } = useResumes()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const statusChipRef = useRef<HTMLDivElement>(null)
  const {
    position,
    company,
    status,
    appliedAt,
    deadline,
    nextInterviewAt,
    location,
    salary,
    jobPostingUrl,
    notes,
    coverLetter,
    resumeId,
  } = application
  const resume = resumes?.find(({ id }) => id === resumeId)

  const copyCoverLetter = async () => {
    if (coverLetter) {
      await navigator.clipboard.writeText(coverLetter)
      showSuccess(t('notifications.coverLetterCopied'))
    }
  }

  const changeStatus = (newStatus: ApplicationStatus) => {
    setStatusMenuOpen(false)

    if (newStatus === status) {
      return
    }

    updateApplication(
      { id: application.id, values: { status: newStatus } },
      {
        onSuccess: () => {
          showSuccess(t('notifications.applicationUpdatedSuccess'))
        },
        onError: () => {
          showError(t('common.errors.unexpected'))
        },
      }
    )
  }

  return (
    <Stack spacing={4}>
      <Box sx={{ overflowWrap: 'anywhere' }}>
        <Stack direction='row' sx={{ mb: 2, justifyContent: 'space-between' }}>
          <Button
            component={RouterLink}
            to='/applications'
            startIcon={<ArrowBackIcon />}
          >
            {t('applications.backToList')}
          </Button>
          <Button
            component={RouterLink}
            to={`/applications/${application.id}/edit`}
            state={{ returnTo: `/applications/${application.id}` }}
            data-testid='application-details-edit'
          >
            {t('common.buttons.edit')}
          </Button>
        </Stack>
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
          data-testid='application-details-status'
          ref={statusChipRef}
          onClick={() => {
            setStatusMenuOpen(true)
          }}
          deleteIcon={<ArrowDropDownIcon />}
          onDelete={() => {
            setStatusMenuOpen(true)
          }}
        />
        <Menu
          anchorEl={statusChipRef.current}
          open={statusMenuOpen}
          onClose={() => {
            setStatusMenuOpen(false)
          }}
        >
          {APPLICATION_STATUSES.map(option => (
            <MenuItem
              key={option}
              selected={option === status}
              onClick={() => {
                changeStatus(option)
              }}
            >
              {t(`applications.statuses.${option}`)}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Stack component='dl' spacing={1.5} sx={{ m: 0 }}>
        <Detail label={t('fields.appliedAt')}>
          {appliedAt
            ? parseDate(appliedAt).toLocaleDateString(i18n.language)
            : EMPTY_VALUE}
        </Detail>
        <Detail label={t('fields.deadline')}>
          {deadline
            ? parseDate(deadline).toLocaleDateString(i18n.language)
            : EMPTY_VALUE}
        </Detail>
        <Detail label={t('fields.nextInterviewAt')}>
          {nextInterviewAt
            ? new Date(nextInterviewAt).toLocaleString(
                i18n.language,
                DATE_TIME_FORMAT
              )
            : EMPTY_VALUE}
        </Detail>
        <Detail label={t('fields.location')}>{location ?? EMPTY_VALUE}</Detail>
        <Detail label={t('fields.salary')}>{salary ?? EMPTY_VALUE}</Detail>
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
        <Detail label={t('fields.resume')}>
          {resume ? (
            <Link
              href={resumeFileUrl(resume.id)}
              target='_blank'
              rel='noopener noreferrer'
            >
              {resume.fileName}
            </Link>
          ) : (
            EMPTY_VALUE
          )}
        </Detail>
      </Stack>

      <StatusTimeline applicationId={application.id} />

      <TextSection
        title={t('fields.notes')}
        text={notes}
        emptyText={t('applications.noNotes')}
        testId='application-details-notes'
      />

      <TextSection
        title={t('fields.coverLetter')}
        text={coverLetter}
        emptyText={t('applications.noCoverLetter')}
        testId='application-details-cover-letter'
        action={
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
        }
      />

      <Stack direction='row' sx={{ justifyContent: 'flex-end' }}>
        <Button
          color='error'
          data-testid='application-details-delete'
          onClick={() => {
            setDeleteDialogOpen(true)
          }}
        >
          {t('common.buttons.delete')}
        </Button>
      </Stack>

      <DeleteApplicationDialog
        application={application}
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
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
