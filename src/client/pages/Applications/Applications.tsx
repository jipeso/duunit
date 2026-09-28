import { useMemo } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import type { ChipProps } from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Link as RouterLink, Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'

import useAuth from '../../hooks/useAuth'
import useApplications from '../../hooks/useApplications'
import type {
  ApplicationResponse,
  ApplicationStatus,
} from '#common/types/applications.ts'

const statusColors: Record<ApplicationStatus, ChipProps['color']> = {
  saved: 'default',
  applied: 'info',
  interviewing: 'warning',
  offer: 'success',
  accepted: 'success',
  rejected: 'error',
  withdrawn: 'default',
}

const sortByDate = (
  first: ApplicationResponse,
  second: ApplicationResponse
) => {
  const firstDate = first.appliedAt ?? first.createdAt
  const secondDate = second.appliedAt ?? second.createdAt
  return secondDate.localeCompare(firstDate)
}

interface ApplicationsListProps {
  userId: string
}

const ApplicationsList = ({ userId }: ApplicationsListProps) => {
  const { t, i18n } = useTranslation()
  const { data: applications, isPending, isError } = useApplications(userId)

  const sortedApplications = useMemo(
    () => [...(applications ?? [])].sort(sortByDate),
    [applications]
  )

  if (isPending) return <CircularProgress />

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Typography
          component='h1'
          variant='h5'
          color='text.primary'
          gutterBottom
        >
          {t('applications.title')}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('applications.subtitle')}
        </Typography>
        <Button
          component={RouterLink}
          to='/applications/new'
          variant='outlined'
        >
          {t('applications.new')}
        </Button>
      </Stack>

      {isError && (
        <Alert severity='error' sx={{ borderRadius: 1, mb: 3 }}>
          {t('common.errors.loadFailed')}
        </Alert>
      )}

      {sortedApplications.length === 0 ? (
        <Paper variant='outlined' sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='body1' color='text.secondary'>
            {t('applications.empty')}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant='outlined'>
          <Table size='small' aria-label={t('applications.title')}>
            <TableHead>
              <TableRow>
                <TableCell>{t('fields.company')}</TableCell>
                <TableCell>{t('fields.position')}</TableCell>
                <TableCell>{t('fields.location')}</TableCell>
                <TableCell>{t('fields.status')}</TableCell>
                <TableCell>{t('fields.appliedAt')}</TableCell>
                <TableCell align='right'>{t('fields.jobPostingUrl')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedApplications.map(application => (
                <TableRow key={application.id} hover>
                  <TableCell>{application.company}</TableCell>
                  <TableCell>{application.position}</TableCell>
                  <TableCell>{application.location ?? '—'}</TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      variant='outlined'
                      color={statusColors[application.status] ?? 'default'}
                      label={t(`applications.statuses.${application.status}`)}
                    />
                  </TableCell>
                  <TableCell>
                    {application.appliedAt
                      ? new Date(application.appliedAt).toLocaleDateString(
                          i18n.language
                        )
                      : '—'}
                  </TableCell>
                  <TableCell align='right'>
                    {application.jobPostingUrl && (
                      <Tooltip title={t('applications.openJobPosting')}>
                        <IconButton
                          size='small'
                          href={application.jobPostingUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          aria-label={t('applications.openJobPosting')}
                        >
                          <OpenInNewIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

const Applications = () => {
  const { state } = useAuth()

  if (state.status === 'loading') return <CircularProgress />

  if (state.status !== 'authenticated') return <Navigate to='/' replace />

  return <ApplicationsList userId={state.user.id} />
}

export default Applications
