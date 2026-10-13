import { useRef } from 'react'
import { useMutation } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type {
  AnalyzeDescription,
  DescriptionAnalysis,
} from '#common/types/jobAnalysis.ts'

const useAnalyzeDescription = () => {
  const controllerRef = useRef<AbortController>(null)

  const mutation = useMutation({
    mutationFn: async (
      values: AnalyzeDescription
    ): Promise<DescriptionAnalysis> => {
      controllerRef.current = new AbortController()
      const { data } = await apiClient.post<DescriptionAnalysis>(
        '/job-analysis',
        values,
        { signal: controllerRef.current.signal }
      )
      return data
    },
  })

  const cancel = () => {
    controllerRef.current?.abort()
    mutation.reset()
  }

  return { ...mutation, cancel }
}

export default useAnalyzeDescription
