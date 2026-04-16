import Session from '../models/Session.js'
import Room from '../models/Room.js'
import { executeCode } from '../utils/judge0.js'
import { JUDGE0_LANGUAGES } from '../config/constants.js'

export const getSessions = async (req, res, next) => {
  try {
    const userId = req.user.userId

    const sessions = await Session.find({
      'users.userId': userId,
    }).populate('roomId')

    const formattedSessions = sessions.map(session => ({
      id: session._id,
      roomCode: session.roomId?.roomCode,
      language: session.language,
      date: session.createdAt,
      duration: '30 mins', // You can calculate this if you have end time
      participants: session.users.map(u => u.username),
    }))

    res.json({
      success: true,
      data: formattedSessions,
    })
  } catch (error) {
    next(error)
  }
}

export const getSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params

    const session = await Session.findById(sessionId).populate('roomId')

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    res.json({
      success: true,
      data: session,
    })
  } catch (error) {
    next(error)
  }
}

export const runSessionCode = async (req, res, next) => {
  try {
    const { sessionId } = req.params
    const { code, language, stdin } = req.body

    const session = await Session.findById(sessionId)

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    // Get language ID for Judge0
    const languageId = JUDGE0_LANGUAGES[language || 'javascript']

    if (!languageId) {
      return res.status(400).json({ message: 'Unsupported language' })
    }

    // Execute code
    const result = await executeCode(code, languageId, stdin || '')

    // Save to execution logs
    session.executionLogs.push({
      code,
      output: result.output,
      status: result.status,
      executedBy: req.user.username,
    })

    await session.save()

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

// Quick code execution endpoint (no session required)
export const quickRunCode = async (req, res, next) => {
  try {
    const { code, language, stdin } = req.body

    // Get language ID for Judge0
    const languageId = JUDGE0_LANGUAGES[language || 'javascript']

    if (!languageId) {
      return res.status(400).json({ message: 'Unsupported language' })
    }

    // Execute code
    const result = await executeCode(code, languageId, stdin || '')

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
