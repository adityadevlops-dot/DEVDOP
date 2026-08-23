export const getToken = () => {
  return localStorage.getItem('token')
}

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

export const clearToken = () => {
  localStorage.removeItem('token')
}

export const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return true
    const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
    const decoded = JSON.parse(decodedJson)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return true
    }
    return false
  } catch (e) {
    return true
  }
}
