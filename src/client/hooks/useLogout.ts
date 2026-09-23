import { useMutation, useQueryClient } from '@tanstack/react-query'

import apiClient from '../util/apiClient'

const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiClient.delete('/logout'),
    onSuccess: () => {
      queryClient.setQueryData(['authenticatedUser'], null)
    },
  })
}

export default useLogout
