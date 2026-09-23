import { createContext, use, type ReactNode } from 'react'

import useAuthenticatedUser from '../hooks/useAuthenticatedUser'
import type { PublicUser } from '#common/types/users.ts'

interface AuthContextValue {
  user: PublicUser | null | undefined
  isLoading: boolean
  isError: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const { data: user, isPending, isError } = useAuthenticatedUser()

  return (
    <AuthContext value={{ user, isLoading: isPending, isError }}>
      {children}
    </AuthContext>
  )
}

export const useAuth = (): AuthContextValue => {
  const context = use(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
