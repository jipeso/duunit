import { useQuery } from '@tanstack/react-query'

import apiClient from '../util/apiClient'
import type { AdminUser } from '#common/types/admin.ts'

const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  const { data } = await apiClient.get<AdminUser[]>('/admin/users')
  return data
}

const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: fetchAdminUsers,
  })
}

export default useAdminUsers
