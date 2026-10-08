import { useMutation, useQueryClient } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import { applicationsQueryKey } from './useApplications.ts'
import { resumesQueryKey } from './useResumes.ts'

const mutationFn = async (id: string) => {
  await apiClient.delete(`/resumes/${id}`)
}

const useDeleteResume = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumesQueryKey })
      void queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
  })
}

export default useDeleteResume
