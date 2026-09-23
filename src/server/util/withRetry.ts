const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const withRetry = async <T>(
  fn: () => Promise<T>,
  attempts: number,
  delayMs: number,
  onRetry: (error: unknown, attempt: number) => void = () => undefined
): Promise<T> => {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === attempts) throw error
      onRetry(error, attempt)
      await wait(delayMs)
    }
  }

  throw new Error('unreachable')
}
