import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    console.log('[AUTH] Registering user:', { username, email })

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      console.log('[AUTH] User already exists:', existingUser.email)
      return res.status(400).json({ success: false, message: 'User already exists' })
    }

    // Create new user
    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    })

    console.log('[AUTH] Saving user...')
    await user.save()
    console.log('[AUTH] User saved successfully:', user._id)

    const token = generateToken(user._id, user.username)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token,
      },
    })
    console.log('[AUTH] Registration successful for:', user.email)
  } catch (error) {
    console.error('[AUTH] Registration error:', error.message)
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password required' 
      })
    }

    const user = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: username.toLowerCase() }],
    })

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      })
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
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

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
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
