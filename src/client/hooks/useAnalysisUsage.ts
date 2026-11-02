import { useQuery } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type { AnalysisUsage } from '#common/types/jobAnalysis.ts'

export const analysisUsageQueryKey = ['jobAnalysisUsage'] as const

const fetchAnalysisUsage = async (): Promise<AnalysisUsage> => {
  const { data } = await apiClient.get<AnalysisUsage>('/job-analysis/usage')
  return data
}

const useAnalysisUsage = () => {
  return useQuery({
    queryKey: analysisUsageQueryKey,
    queryFn: fetchAnalysisUsage,
  })
}

export default useAnalysisUsage
