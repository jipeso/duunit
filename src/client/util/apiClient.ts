import axios, { isAxiosError } from 'axios'

import queryClient from './queryClient'

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

apiClient.interceptors.response.use(undefined, (error: Error) => {
  if (
    isAxiosError(error) &&
    error.response?.status === 401 &&
    window.location.pathname !== '/login'
  ) {
    queryClient.clear()
    window.location.assign('/login')
  }
  return Promise.reject(error)
})

export const isNotFoundError = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 404

export default apiClient
