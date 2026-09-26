import { Navigate, Outlet } from 'react-router'
import CircularProgress from '@mui/material/CircularProgress'

import useAuth from '../hooks/useAuth'

const GuestRoute = () => {
  const { state } = useAuth()

  if (state.status === 'loading') return <CircularProgress />

  if (state.status === 'authenticated') return <Navigate to='/' replace />

  return <Outlet />
}

export default GuestRoute
