import { Link as RouterLink } from 'react-router'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { useTranslation } from 'react-i18next'

import { authClient } from '../../util/authClient'
import PageLoader from '../../components/common/PageLoader'
import Dashboard from './Dashboard'
import PageHeading from '../../components/common/PageHeading'

const Home = () => {
  const { t } = useTranslation()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <PageLoader />
  }

  if (session) {
    return <Dashboard />
  }

  return (
    <Container maxWidth='sm'>
      <PageHeading title={t('home.title')} subtitle={t('home.description')} />

      <Stack direction='row' spacing={2}>
        <Button component={RouterLink} to='/register' variant='contained'>
          {t('navigation.register')}
        </Button>
        <Button component={RouterLink} to='/login' variant='outlined'>
          {t('navigation.login')}
        </Button>
      </Stack>
    </Container>
  )
}

export default Home
