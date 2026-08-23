import env from './env.js'

export const getCorsOrigins = () => {
  if (env.CORS_ORIGIN) {
    return env.CORS_ORIGIN.split(',').map((o) => o.trim())
  }
  if (env.NODE_ENV === 'production') {
    throw new Error('[FATAL] CORS_ORIGIN environment variable is required in production!')
  }
  return ['http://localhost:5173', 'http://localhost:5000', 'http://localhost:3000']
}
