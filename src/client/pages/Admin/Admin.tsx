import { Typography } from '@mui/material'
import { Navigate } from 'react-router'

import useAuthenticatedUser from '../../hooks/useAuthenticatedUser'

const Admin = () => {
  const { data: user } = useAuthenticatedUser()

  if (!user?.roles.includes('admin')) return <Navigate to='/' />

  return (
    <Typography component='h1' variant='h4'>
      Admin page
    </Typography>
  )
}

export default Admin
