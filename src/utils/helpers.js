export const generateRoomCode = () => {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()
}

export const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export const getColorForUser = (username, index = 0) => {
  const colors = [
    '#ff2c2c', // accent-red
    '#ffd700', // accent-gold
    '#ff8c00', // accent-orange
    '#00d9ff', // accent-teal
    '#00d652', // accent-green
  ]
  const hash = username.charCodeAt(0) + (index % 5)
  return colors[hash % colors.length]
}

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}
