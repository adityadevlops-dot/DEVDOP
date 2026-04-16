import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devdop'

console.log('🔗 Connecting to MongoDB:', MONGODB_URI)

const connectDB = async (retries = 3) => {
  try {
    await mongoose.connect(MONGODB_URI, {
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
