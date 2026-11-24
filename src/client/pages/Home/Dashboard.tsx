import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import useApplications from '../../hooks/useApplications'
import PageLoader from '../../components/common/PageLoader'
import ApplicationsSentChart from './ApplicationsSentChart'
import UpcomingEvents from './UpcomingEvents'

const Dashboard = () => {
  const { t } = useTranslation()
  const { data: applications, isPending, isError } = useApplications()
  const [now] = useState(() => new Date())

  if (isPending) {
    return <PageLoader />
  }

  return (
    <Container maxWidth='sm'>
      <Typography component='h1' variant='h5' gutterBottom>
        {t('home.overview')}
      </Typography>

      <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
        {t('home.overviewSubtitle')}
      </Typography>

      {isError && (
        <Alert severity='error' sx={{ borderRadius: 1, mb: 3 }}>
          {t('common.errors.loadFailed')}
        </Alert>
      )}

      {applications && (
        <Stack spacing={3}>
          <UpcomingEvents applications={applications} now={now} />
          <ApplicationsSentChart applications={applications} now={now} />
        </Stack>
      )}
    </Container>
  )
}

export default Dashboard
