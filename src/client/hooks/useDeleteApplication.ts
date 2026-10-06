import { useMutation, useQueryClient } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import { applicationsQueryKey } from './useApplications.ts'

const mutationFn = async (id: string) => {
  await apiClient.delete(`/applications/${id}`)
}

const useDeleteApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
  })
}

export default useDeleteApplication
