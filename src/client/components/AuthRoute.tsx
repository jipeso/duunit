import { Navigate, Outlet } from 'react-router'
import CircularProgress from '@mui/material/CircularProgress'

import { authClient } from '../util/authClient'

interface Props {
  access: 'guest' | 'user' | 'admin'
}

const AuthRoute = ({ access }: Props) => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <CircularProgress />

  const allowed = {
    guest: !session,
    user: !!session,
    admin: session?.user.role === 'admin',
  }[access]

  return allowed ? <Outlet /> : <Navigate to='/' replace />
}

export default AuthRoute
