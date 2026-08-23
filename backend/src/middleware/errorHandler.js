import env from '../config/env.js'

export const errorHandler = (err, req, res, next) => {
  const isDev = env.NODE_ENV !== 'production'
  console.error(`❌ [ERROR] ${req.method} ${req.originalUrl}:`, err.message || err)

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const fields = Object.keys(err.errors || {}).reduce((acc, key) => {
      acc[key] = err.errors[key].message
      return acc
    }, {})
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: fields,
    })
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid format for field '${err.path}'`,
    })
  }

  // Mongo duplicate key (11000)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Resource already exists',
    })
  }

  const statusCode = err.statusCode || err.status || 500
  const userMessage = statusCode === 500 && !isDev ? 'Internal server error' : (err.message || 'Server Error')

  return res.status(statusCode).json({
    success: false,
    message: userMessage,
    ...(isDev && { stack: err.stack }),
  })
}
