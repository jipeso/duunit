import { QueryClient } from '@tanstack/react-query'

const staleTime = 1000 * 60 * 2 // 2 minutes

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime,
    },
  },
})

export default queryClient
