import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        username: String,
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    code_content: {
      type: String,
      default: '// Start coding here...\n',
    },
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp', 'go', 'typescript', 'rust', 'c'],
      default: 'javascript',
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    maxParticipants: {
      type: Number,
      default: 2,
    },
  },
  {
    timestamps: true,
    // Auto-delete rooms after 24 hours
    expires: 86400,
  }
)

// Index for fast room code lookup
roomSchema.index({ roomCode: 1 })
roomSchema.index({ createdBy: 1 })

export default mongoose.model('Room', roomSchema)
