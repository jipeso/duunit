import { useMutation, useQueryClient } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type {
  ApplicationResponse,
  NewApplication,
} from '#common/types/applications.ts'
import { applicationsQueryKey } from './useApplications.ts'

const mutationFn = async (
  values: NewApplication
): Promise<ApplicationResponse> => {
  const { data } = await apiClient.post<ApplicationResponse>(
    '/applications',
    values
  )
  return data
}

const useCreateApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
  })
}

export default useCreateApplication
