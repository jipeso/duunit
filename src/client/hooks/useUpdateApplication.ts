import { useMutation, useQueryClient } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type {
  ApplicationResponse,
  UpdateApplication,
} from '#common/types/applications.ts'

const applicationsQueryKey = ['applications'] as const

interface UpdateApplicationProps {
  id: string
  values: UpdateApplication
}

const mutationFn = async ({
  id,
  values,
}: UpdateApplicationProps): Promise<ApplicationResponse> => {
  const { data } = await apiClient.patch<ApplicationResponse>(
    `/applications/${id}`,
    values
  )
  return data
}

const useUpdateApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
  })
}

export default useUpdateApplication
