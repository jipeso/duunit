import { useMutation, useQueryClient } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type { ResumeResponse } from '#common/types/resumes.ts'
import { resumesQueryKey } from './useResumes.ts'

const mutationFn = async (file: File): Promise<ResumeResponse> => {
  const { data } = await apiClient.post<ResumeResponse>('/resumes', file, {
    params: { name: file.name },
    headers: { 'Content-Type': 'application/pdf' },
  })
  return data
}

const useUploadResume = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumesQueryKey })
    },
  })
}

export default useUploadResume
