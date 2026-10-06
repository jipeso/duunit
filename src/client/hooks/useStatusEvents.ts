import { useQuery } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type { StatusEventResponse } from '#common/types/applications.ts'

export const statusEventsQueryKey = (id: string) =>
  ['statusEvents', id] as const

const fetchStatusEvents = async (
  id: string
): Promise<StatusEventResponse[]> => {
  const { data } = await apiClient.get<StatusEventResponse[]>(
    `/applications/${id}/events`
  )
  return data
}

const useStatusEvents = (id: string) => {
  return useQuery({
    queryKey: statusEventsQueryKey(id),
    queryFn: () => fetchStatusEvents(id),
  })
}

export default useStatusEvents
