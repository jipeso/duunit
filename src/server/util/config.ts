export const PORT = process.env.PORT ?? 3000
export const DATABASE_URL = process.env.DATABASE_URL ?? ''
export const LLM_URL = process.env.LLM_URL ?? ''
export const LLM_API_KEY = process.env.LLM_API_KEY ?? ''
export const LLM_MODEL = process.env.LLM_MODEL ?? ''
export const inProduction = process.env.NODE_ENV === 'production'
export const inDevelopment = process.env.NODE_ENV === 'development'
export const inTest = process.env.NODE_ENV === 'test'
