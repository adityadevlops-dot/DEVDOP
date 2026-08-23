import rateLimit from 'express-rate-limit'

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts, please try again later' },
})

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
})

export const runCodeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Code execution rate limit exceeded. Max 10 runs per minute.' },
})
