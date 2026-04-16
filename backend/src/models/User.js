import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'in-session'],
      default: 'offline',
    },
    currentRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      default: null,
    },
  },
  { timestamps: true }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Remove password from JSON response
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  // Add id alias for _id for frontend compatibility
  user.id = user._id.toString()
  return user
}

// Compare password
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcryptjs.compare(plainPassword, this.password)
}

export default mongoose.model('User', userSchema)
