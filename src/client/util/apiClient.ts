import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

interface ErrorResponse {
  error?: string
}
const authRoutes = ['/login', '/refresh', '/logout']

const refreshAccessToken = () => axios.post('/api/refresh')

const canRefresh = (
  error: AxiosError<ErrorResponse>,
  config?: RetryConfig
): config is RetryConfig =>
  error.response?.status === 401 &&
  error.response.data.error === 'token expired' &&
  !!config &&
  !config._retry &&
  !authRoutes.includes(config.url ?? '')

apiClient.interceptors.response.use(undefined, async (error: unknown) => {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    throw error
  }

  const config = error.config as RetryConfig | undefined

  if (!canRefresh(error, config)) {
    throw error
  }

  config._retry = true

  await refreshAccessToken()
  return apiClient(config)
})

export default apiClient
