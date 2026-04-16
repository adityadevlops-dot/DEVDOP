import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    users: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        username: String,
      },
    ],
    code: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp', 'go', 'typescript', 'rust', 'c'],
      default: 'javascript',
    },
    executionLogs: [
      {
        timestamp: { type: Date, default: Date.now },
        code: String,
        output: String,
        status: String,
        executedBy: String,
      },
    ],
    messages: [
      {
        username: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    // Auto-delete sessions after 30 days
    expires: 2592000,
  }
)

// Index for fast session lookups
sessionSchema.index({ roomId: 1 })
sessionSchema.index({ 'users.userId': 1 })

export default mongoose.model('Session', sessionSchema)
