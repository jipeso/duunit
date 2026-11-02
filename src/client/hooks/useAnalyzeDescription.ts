import { useMutation, useQueryClient } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type {
  AnalyzeDescription,
  DescriptionAnalysis,
} from '#common/types/jobAnalysis.ts'
import { analysisUsageQueryKey } from './useAnalysisUsage.ts'

const useAnalyzeDescription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: AnalyzeDescription) => {
      const { data } = await apiClient.post<DescriptionAnalysis>(
        '/job-analysis',
        values
      )
      return data
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: analysisUsageQueryKey })
    },
  })
}

export default useAnalyzeDescription
