import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'
import env from '../config/env.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!USERNAME_REGEX.test(trimmedUsername)) {
      return res.status(400).json({
        success: false,
        message: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores',
      })
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format',
      })
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one letter and one number',
      })
    }

    const existingUser = await User.findOne({
      $or: [{ email: trimmedEmail }, { username: trimmedUsername.toLowerCase() }],
    })

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' })
    }

    const user = new User({
      username: trimmedUsername,
      email: trimmedEmail,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${trimmedUsername}`,
    })

    await user.save()

    const token = generateToken(user._id, user.username)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token,
      },
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'User already exists' })
    }
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password required',
      })
    }

    const sanitizedIdentifier = String(username).trim().toLowerCase()

    const user = await User.findOne({
      $or: [{ username: sanitizedIdentifier }, { email: sanitizedIdentifier }],
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const token = generateToken(user._id, user.username)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const googleAuth = async (req, res, next) => {
  try {
    const { credential, idToken } = req.body
    const tokenToVerify = credential || idToken

    if (!tokenToVerify) {
      return res.status(400).json({ success: false, message: 'Google credential or ID token is required' })
    }

    let payload
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: tokenToVerify,
        audience: env.GOOGLE_CLIENT_ID || undefined,
      })
      payload = ticket.getPayload()
    } catch (verifyError) {
      return res.status(401).json({ success: false, message: 'Invalid or expired Google ID token' })
    }

    const { sub: googleId, email, name, picture } = payload

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google account email is required' })
    }

    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }],
    })

    if (!user) {
      let baseUsername = (name || email.split('@')[0])
        .replace(/[^a-zA-Z0-9_]/g, '')
        .toLowerCase()
      if (baseUsername.length < 3) baseUsername = `user_${baseUsername}`
      baseUsername = baseUsername.substring(0, 15)

      let uniqueUsername = baseUsername
      let count = 1
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}_${count}`
        count++
      }

      user = new User({
        username: uniqueUsername,
        email: email.toLowerCase(),
        googleId,
        authProvider: 'google',
        avatar: picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uniqueUsername}`,
      })
      await user.save()
    } else if (!user.googleId) {
      user.googleId = googleId
      user.authProvider = 'google'
      if (picture && user.avatar?.includes('dicebear')) {
        user.avatar = picture
      }
      await user.save()
    }

    const token = generateToken(user._id, user.username)

    return res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user: user.toJSON(),
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    })
  } catch (error) {
    next(error)
  }
}
