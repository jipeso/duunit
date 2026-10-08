import { useQuery } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type { ResumeResponse } from '#common/types/resumes.ts'

export const resumesQueryKey = ['resumes'] as const

const fetchResumes = async (): Promise<ResumeResponse[]> => {
  const { data } = await apiClient.get<ResumeResponse[]>('/resumes')
  return data
}

const useResumes = () => {
  return useQuery({
    queryKey: resumesQueryKey,
    queryFn: fetchResumes,
  })
}

export default useResumes
