import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import connectDB from '../config/db.js'

dotenv.config()

const seedUsers = [
  {
    username: 'alex',
    email: 'alex@devdop.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  },
  {
    username: 'jordan',
    email: 'jordan@devdop.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
  },
  {
    username: 'casey',
    email: 'casey@devdop.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=casey',
  },
  {
    username: 'morgan',
    email: 'morgan@devdop.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=morgan',
  },
  {
    username: 'taylor',
    email: 'taylor@devdop.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taylor',
  },
]

const seed = async () => {
  try {
    await connectDB(1)

    // Clear existing users
    await User.deleteMany({})
    console.log('🗑️  Cleared existing users')

    // Create seed users
    const createdUsers = await User.insertMany(seedUsers)
    console.log(`✅ Seeded ${createdUsers.length} users:`)
    createdUsers.forEach((user) => {
      console.log(`  👤 ${user.username} (${user.email})`)
    })

    console.log('\n📝 Seed credentials:')
    console.log(`  username: alex / password: password123`)
    console.log(`  username: jordan / password: password123`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  }
}

seed()
