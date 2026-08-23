import axios from 'axios'
import env from '../config/env.js'

export const executeCode = async (code, languageId, stdin = '') => {
  try {
    if (!code || typeof code !== 'string') {
      return { success: false, output: 'Code is required', status: 'Bad Request' }
    }

    if (code.length > 50000) {
      return { success: false, output: 'Code payload exceeds 50,000 character limit', status: 'Payload Too Large' }
    }

    if (stdin && stdin.length > 10000) {
      return { success: false, output: 'Stdin payload exceeds 10,000 character limit', status: 'Payload Too Large' }
    }

    const apiUrl = env.JUDGE0_API_URL
    const apiKey = env.JUDGE0_API_KEY
    const isProd = env.NODE_ENV === 'production'

    if (!apiUrl || !apiKey) {
      if (isProd) {
        return {
          success: false,
          output: 'Judge0 API is not configured on this server.',
          status: 'Server Configuration Error',
        }
      }
      return {
        success: true,
        output: '[MOCK EXECUTION - DEV MODE]\nCode executed successfully.\nSet JUDGE0_API_KEY and JUDGE0_API_URL in backend/.env for live execution.',
        status: 'Accepted (Mock)',
        statusId: 3,
      }
    }

    let parsedHost = ''
    try {
      parsedHost = new URL(apiUrl).host
    } catch (e) {
      parsedHost = 'judge0-ce.p.rapidapi.com'
    }

    const headers = { 'Content-Type': 'application/json' }
    if (parsedHost.includes('rapidapi')) {
      headers['x-rapidapi-key'] = apiKey
      headers['x-rapidapi-host'] = parsedHost
    } else {
      headers['X-Auth-Token'] = apiKey
    }

    const submitResponse = await axios.post(
      `${apiUrl.replace(/\/+$/, '')}/submissions?base64_encoded=false&wait=false`,
      {
        source_code: code,
        language_id: languageId,
        stdin,
      },
      { headers, timeout: 10000 }
    )

    const submissionId = submitResponse.data?.token
    if (!submissionId) {
      return { success: false, output: 'Failed to retrieve submission token from Judge0', status: 'Execution Error' }
    }

    let result = null
    let attempts = 0
    const maxAttempts = 16 // 16 * 500ms = 8s timeout limit

    while (attempts < maxAttempts) {
      const resultResponse = await axios.get(
        `${apiUrl.replace(/\/+$/, '')}/submissions/${submissionId}?base64_encoded=false`,
        { headers, timeout: 10000 }
      )

      result = resultResponse.data
      if (result && result.status && result.status.id > 2) {
        break
      }

      await new Promise((res) => setTimeout(res, 500))
      attempts++
    }

    if (!result || !result.status) {
      return {
        success: false,
        output: 'Execution timed out (8s limit exceeded)',
        status: 'Timeout',
      }
    }

    const statusId = result.status.id
    const isSuccess = statusId === 3

    return {
      success: isSuccess,
      output: result.stdout || result.stderr || result.compile_output || '',
      status: result.status.description || 'Executed',
      statusId,
      error: result.stderr || result.compile_output || '',
    }
  } catch (error) {
    console.error('[JUDGE0 EXECUTION ERROR]:', error.message)
    return {
      success: false,
      output: '',
      status: 'Error',
      error: error.response?.data?.message || error.message,
    }
  }
}
