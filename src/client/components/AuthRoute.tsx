import { Navigate, Outlet } from 'react-router'

import { authClient } from '../util/authClient'
import PageLoader from './common/PageLoader'

interface Props {
  access: 'guest' | 'user' | 'admin'
}

const AuthRoute = ({ access }: Props) => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <PageLoader />

  const allowed = {
    guest: !session,
    user: !!session,
    admin: session?.user.role === 'admin',
  }[access]

  return allowed ? <Outlet /> : <Navigate to='/' replace />
}

export default AuthRoute
