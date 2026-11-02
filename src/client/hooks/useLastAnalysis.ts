import { useQuery } from '@tanstack/react-query'

import type { DescriptionAnalysis } from '#common/types/jobAnalysis.ts'

export interface LastAnalysis {
  description: string
  result: DescriptionAnalysis
}

export const lastAnalysisQueryKey = ['lastJobAnalysis'] as const

const useLastAnalysis = () => {
  return useQuery({
    queryKey: lastAnalysisQueryKey,
    queryFn: (): LastAnalysis | null => null,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export default useLastAnalysis
