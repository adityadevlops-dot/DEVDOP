import { describe, it, expect } from 'vitest'
import { generateRoomCode, validateEmail, validatePassword, getInitials, getColorForUser } from './helpers'

describe('Frontend Helper Functions', () => {
  it('generateRoomCode produces a 6 character uppercase string', () => {
    const code = generateRoomCode()
    expect(code).toHaveLength(6)
    expect(code).toBe(code.toUpperCase())
  })

  it('validateEmail correctly identifies valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('invalid-email')).toBe(false)
  })

  it('validatePassword requires at least 8 characters', () => {
    expect(validatePassword('12345678')).toBe(true)
    expect(validatePassword('1234')).toBe(false)
  })

  it('getInitials extracts user initials', () => {
    expect(getInitials('John Doe')).toBe('JD')
    expect(getInitials('Alex')).toBe('A')
  })

  it('getColorForUser returns consistent color', () => {
    const color1 = getColorForUser('alex')
    const color2 = getColorForUser('alex')
    expect(color1).toBe(color2)
  })
})
