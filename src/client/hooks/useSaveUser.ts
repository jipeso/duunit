import { useMutation } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type { NewUser, PublicUser } from '#common/types/users.ts'

const mutationFn = async (values: NewUser): Promise<PublicUser> => {
  const { data } = await apiClient.post<PublicUser>('/users', values)
  return data
}

const useSaveUser = () => {
  return useMutation({
    mutationFn,
  })
}

export default useSaveUser
