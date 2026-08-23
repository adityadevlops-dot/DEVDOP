import dotenv from 'dotenv'
dotenv.config()

const nodeEnv = process.env.NODE_ENV || 'development'
const isProduction = nodeEnv === 'production'

let jwtSecret = process.env.JWT_SECRET

if (isProduction) {
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error('[FATAL] JWT_SECRET must be set and at least 32 characters long in production!')
  }
} else {
  if (!jwtSecret) {
    jwtSecret = 'devdop_default_development_secret_key_min_32_chars!'
  }
}

export const env = {
  NODE_ENV: nodeEnv,
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/devdop',
  JWT_SECRET: jwtSecret,
  JUDGE0_API_URL: process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
  JUDGE0_API_KEY: process.env.JUDGE0_API_KEY || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5000,http://localhost:5173',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
}

export default env
