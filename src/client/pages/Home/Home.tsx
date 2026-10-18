import { Link as RouterLink } from 'react-router'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import { authClient } from '../../util/authClient'
import PageLoader from '../../components/common/PageLoader'
import Dashboard from './Dashboard'

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
      <Typography component='h1' variant='h5' gutterBottom>
        {t('home.title')}
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        {t('home.description')}
      </Typography>

      <Stack direction='row' spacing={2} sx={{ mt: 3 }}>
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
