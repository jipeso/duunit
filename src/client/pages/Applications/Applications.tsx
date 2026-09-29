import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'

import useAuth from '../../hooks/useAuth'
import useApplications from '../../hooks/useApplications'
import ApplicationGrid from './ApplicationGrid'

interface ApplicationsListProps {
  userId: string
}

const ApplicationsList = ({ userId }: ApplicationsListProps) => {
  const { t } = useTranslation()
  const { data: applications, isPending, isError } = useApplications(userId)

  if (isPending) {
    return <CircularProgress />
  }

  const rows = applications ?? []

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
          variant='contained'
        >
          {t('applications.new')}
        </Button>
      </Stack>

      {isError && (
        <Alert severity='error' sx={{ borderRadius: 1, mb: 3 }}>
          {t('common.errors.loadFailed')}
        </Alert>
      )}

      {rows.length === 0 ? (
        <Paper variant='outlined' sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='body1' color='text.secondary'>
            {t('applications.empty')}
          </Typography>
        </Paper>
      ) : (
        <ApplicationGrid applications={rows} />
      )}
    </Container>
  )
}

const Applications = () => {
  const { state } = useAuth()

  if (state.status === 'loading') {
    return <CircularProgress />
  }

  if (state.status !== 'authenticated') {
    return <Navigate to='/' replace />
  }

  return <ApplicationsList userId={state.user.id} />
}

export default Applications
