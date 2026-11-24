import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { useTranslation } from 'react-i18next'

import useApplications from '../../hooks/useApplications'
import PageLoader from '../../components/common/PageLoader'
import ApplicationsSentChart from './ApplicationsSentChart'
import FollowUps from './FollowUps'
import UpcomingEvents from './UpcomingEvents'
import PageHeading from '../../components/common/PageHeading'

const Dashboard = () => {
  const { t } = useTranslation()
  const { data: applications, isPending, isError } = useApplications()
  const [now] = useState(() => new Date())

  if (isPending) {
    return <PageLoader />
  }

  return (
    <Container maxWidth='sm'>
      <PageHeading title={t('home.overview')} />

      {isError && (
        <Alert severity='error' sx={{ borderRadius: 1, mb: 3 }}>
          {t('common.errors.loadFailed')}
        </Alert>
      )}

      {applications && (
        <Stack spacing={3}>
          <UpcomingEvents applications={applications} now={now} />
          <FollowUps applications={applications} now={now} />
          <ApplicationsSentChart applications={applications} now={now} />
        </Stack>
      )}
    </Container>
  )
}

export default Dashboard
