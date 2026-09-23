import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router'
import CircularProgress from '@mui/material/CircularProgress'

import { useAuth } from '../../components/AuthProvider'

const Profile = () => {
  const { t } = useTranslation()
  const { user, isLoading } = useAuth()

  if (isLoading) return <CircularProgress />

  if (!user) return <Navigate to='/' />

  return (
    <Container maxWidth='sm' sx={{ mt: 4 }}>
      <Paper variant='outlined' sx={{ p: 3 }}>
        <Typography variant='h5' gutterBottom></Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              {t('common.name')}
            </Typography>
            <Typography variant='body1'>{user.name}</Typography>
          </Box>

          <Box>
            <Typography variant='body2' color='text.secondary'>
              {t('common.email')}
            </Typography>
            <Typography variant='body1'>{user.email}</Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  )
}

export default Profile
