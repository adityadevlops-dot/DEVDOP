import Session from '../models/Session.js'
import { executeCode } from '../utils/judge0.js'
import { JUDGE0_LANGUAGES } from '../config/constants.js'

export const getSessions = async (req, res, next) => {
  try {
    const userId = req.user.userId

    const sessions = await Session.find({
      'users.userId': userId,
    }).populate('roomId')

    const formattedSessions = sessions.map((session) => ({
      id: session._id,
      roomCode: session.roomId?.roomCode,
      language: session.language,
      date: session.createdAt,
      duration: '30 mins',
      participants: session.users.map((u) => u.username),
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
      return res.status(404).json({ success: false, message: 'Session not found' })
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

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Code is required' })
    }

    if (code.length > 50000) {
      return res.status(400).json({ success: false, message: 'Code exceeds 50,000 character limit' })
    }

    if (stdin && stdin.length > 10000) {
      return res.status(400).json({ success: false, message: 'Stdin exceeds 10,000 character limit' })
    }

    const session = await Session.findById(sessionId)

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' })
    }

    const languageId = JUDGE0_LANGUAGES[language || 'javascript']

    if (!languageId) {
      return res.status(400).json({ success: false, message: 'Unsupported language' })
    }

    const result = await executeCode(code, languageId, stdin || '')

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

export const quickRunCode = async (req, res, next) => {
  try {
    const { code, language, stdin } = req.body

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Code is required' })
    }

    if (code.length > 50000) {
      return res.status(400).json({ success: false, message: 'Code exceeds 50,000 character limit' })
    }

    if (stdin && stdin.length > 10000) {
      return res.status(400).json({ success: false, message: 'Stdin exceeds 10,000 character limit' })
    }

    const languageId = JUDGE0_LANGUAGES[language || 'javascript']

    if (!languageId) {
      return res.status(400).json({ success: false, message: 'Unsupported language' })
    }

    const result = await executeCode(code, languageId, stdin || '')

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
