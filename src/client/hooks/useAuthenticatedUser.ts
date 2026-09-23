import { useQuery } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type { PublicUser } from '#common/types/users.ts'

const queryFn = async () => {
  const { data } = await apiClient.get<PublicUser>('/me')
  return data
}

const useAuthenticatedUser = () => {
  return useQuery({
    queryKey: ['authenticatedUser'],
    queryFn,
    retry: false,
  })
}

export default useAuthenticatedUser
