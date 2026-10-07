import { useMutation, useQueryClient } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import { statusEventsQueryKey } from './useStatusEvents.ts'

interface UpdateStatusEventProps {
  applicationId: string
  eventId: string
  occurredOn: string
}

const mutationFn = async ({
  applicationId,
  eventId,
  occurredOn,
}: UpdateStatusEventProps) => {
  await apiClient.patch(`/applications/${applicationId}/events/${eventId}`, {
    occurredOn,
  })
}

const useUpdateStatusEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (_, { applicationId }) => {
      void queryClient.invalidateQueries({
        queryKey: statusEventsQueryKey(applicationId),
      })
    },
  })
}

export default useUpdateStatusEvent
