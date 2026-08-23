import env from '../config/env.js'

export const requestLogger = (req, res, next) => {
  if (env.NODE_ENV === 'production') {
    return next()
  }

  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`)
  })

  next()
}
