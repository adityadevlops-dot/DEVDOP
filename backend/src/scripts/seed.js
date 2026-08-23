import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import connectDB from '../config/db.js'

dotenv.config()

if (process.env.NODE_ENV === 'production') {
  console.error('❌ Refusing to run seed script in production!')
  process.exit(1)
}

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

    await User.deleteMany({})
    console.log('🗑️  Cleared existing users')

    const createdUsers = []
    for (const userData of seedUsers) {
      const user = new User(userData)
      await user.save()
      createdUsers.push(user)
    }

    console.log(`✅ Seeded ${createdUsers.length} users with bcrypt password hashing:`)
    createdUsers.forEach((user) => {
      console.log(`  👤 ${user.username} (${user.email})`)
    })

    console.log('\n📝 Seed credentials:')
    console.log(`  username: alex / password: password123`)
    console.log(`  username: jordan / password: password123`)

    await mongoose.connection.close()
    console.log('✅ Mongoose connection closed cleanly')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error.message)
    try {
      await mongoose.connection.close()
    } catch (e) {}
    process.exit(1)
  }
}

seed()
