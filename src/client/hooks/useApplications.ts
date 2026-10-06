import { useQuery } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type { ApplicationResponse } from '#common/types/applications.ts'

export const applicationsQueryKey = ['applications'] as const

const fetchApplications = async (): Promise<ApplicationResponse[]> => {
  const { data } = await apiClient.get<ApplicationResponse[]>('/applications')
  return data
}

const useApplications = () => {
  return useQuery({
    queryKey: applicationsQueryKey,
    queryFn: fetchApplications,
  })
}

export default useApplications
