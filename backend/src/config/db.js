import mongoose from 'mongoose'
import { env } from './env.js'

const connectDB = async (retries = 3) => {
  try {
    const hostName = env.MONGODB_URI.split('@')[1] ? env.MONGODB_URI.split('@')[1].split('/')[0] : 'localhost'
    console.log(`🔗 Connecting to MongoDB host: ${hostName}`)
    await mongoose.connect(env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    if (retries > 0) {
      console.log(`Retrying in 3s... (${retries} attempts left)`)
      setTimeout(() => connectDB(retries - 1), 3000)
    } else {
      process.exit(1)
    }
  }
}

export default connectDB
