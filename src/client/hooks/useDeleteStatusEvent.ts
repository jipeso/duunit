import { useMutation, useQueryClient } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import { applicationsQueryKey } from './useApplications.ts'
import { statusEventsQueryKey } from './useStatusEvents.ts'

interface DeleteStatusEventProps {
  applicationId: string
  eventId: string
}

const mutationFn = async ({
  applicationId,
  eventId,
}: DeleteStatusEventProps) => {
  await apiClient.delete(`/applications/${applicationId}/events/${eventId}`)
}

const useDeleteStatusEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (_, { applicationId }) => {
      void queryClient.invalidateQueries({
        queryKey: statusEventsQueryKey(applicationId),
      })
      void queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
  })
}

export default useDeleteStatusEvent
