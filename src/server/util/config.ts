export const PORT = process.env.PORT ?? 3000
export const DATABASE_URL = process.env.DATABASE_URL ?? ''
export const inProduction = process.env.NODE_ENV === 'production'
export const inDevelopment = process.env.NODE_ENV === 'development'
export const inTest = process.env.NODE_ENV === 'test'

export const JWT_SECRET = process.env.JWT_SECRET ?? ''
