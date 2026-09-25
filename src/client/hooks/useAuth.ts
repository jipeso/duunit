import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import apiClient from '../util/apiClient'
import type { LoginCredentials, PublicUser } from '#common/types/users.ts'

export type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: PublicUser }
  | { status: 'unauthenticated' }
  | { status: 'error'; error: unknown }

const authQueryKey = ['auth', 'user'] as const

const getCurrentUser = async (): Promise<PublicUser | null> => {
  try {
    const { data } = await apiClient.get<PublicUser>('/me')
    return data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null
    }

    throw error
  }
}

const login = async (credentials: LoginCredentials): Promise<PublicUser> => {
  const { data } = await apiClient.post<PublicUser>('/login', credentials)
  return data
}

const logout = async (): Promise<void> => {
  await apiClient.delete('/logout')
}

const useAuth = () => {
  const queryClient = useQueryClient()
  const userQuery = useQuery({
    queryKey: authQueryKey,
    queryFn: getCurrentUser,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: user => {
      queryClient.setQueryData(authQueryKey, user)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKey, null)
    },
  })

  let state: AuthState

  if (userQuery.isPending) {
    state = { status: 'loading' }
  } else if (userQuery.isError) {
    state = { status: 'error', error: userQuery.error }
  } else if (userQuery.data) {
    state = { status: 'authenticated', user: userQuery.data }
  } else {
    state = { status: 'unauthenticated' }
  }

  return {
    state,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}

export default useAuth
