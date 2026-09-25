import { Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { Navigate } from 'react-router'

import useAuth from '../../hooks/useAuth'

const Admin = () => {
  const { state } = useAuth()

  if (state.status === 'loading') return <CircularProgress />

  if (state.status !== 'authenticated' || !state.user.roles.includes('admin')) {
    return <Navigate to='/' replace />
  }

  return (
    <Typography component='h1' variant='h4'>
      Admin page
    </Typography>
  )
}

export default Admin
