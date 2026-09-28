import { useQuery } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type { ApplicationResponse } from '#common/types/applications.ts'

const applicationsQueryKey = ['applications'] as const

const fetchApplications = async (
  userId: string
): Promise<ApplicationResponse[]> => {
  const { data } = await apiClient.get<ApplicationResponse[]>(
    `/applications/${userId}`
  )
  return data
}

const useApplications = (userId: string) => {
  return useQuery({
    queryKey: [...applicationsQueryKey, userId],
    queryFn: () => fetchApplications(userId),
  })
}

export default useApplications
