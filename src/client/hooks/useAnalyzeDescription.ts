import { useMutation } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type {
  AnalyzeDescription,
  DescriptionAnalysis,
} from '#common/types/jobAnalysis.ts'

const useAnalyzeDescription = () =>
  useMutation({
    mutationFn: async (values: AnalyzeDescription) => {
      const { data } = await apiClient.post<DescriptionAnalysis>(
        '/job-analysis',
        values
      )
      return data
    },
  })

export default useAnalyzeDescription
