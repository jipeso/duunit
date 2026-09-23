export const mode = import.meta.env.MODE
export const inProduction = mode === 'production'
export const inDevelopment = mode === 'development'
export const inTest = mode === 'test'

export const DRAWER_WIDTH = 240
