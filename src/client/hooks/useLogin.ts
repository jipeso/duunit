import { useMutation, useQueryClient } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type { LoginCredentials, PublicUser } from '#common/types/users.ts'

const login = async (credentials: LoginCredentials): Promise<PublicUser> => {
  const { data } = await apiClient.post<PublicUser>('/login', credentials)
  return data
}

const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: authenticatedUser => {
      queryClient.setQueryData(['authenticatedUser'], authenticatedUser)
    },
  })
}

export default useLogin
