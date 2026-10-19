import axios, { isAxiosError } from 'axios'

import queryClient from './queryClient'
import { today } from './date'

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

apiClient.interceptors.request.use(config => {
  config.headers.set('X-Local-Date', today())
  return config
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

export const isUnprocessableError = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 422

export const isTooManyRequestsError = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 429

export default apiClient
