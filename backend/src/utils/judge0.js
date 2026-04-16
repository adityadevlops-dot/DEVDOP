import axios from 'axios'
import { JUDGE0_STATUS_ID } from '../config/constants.js'

const JUDGE0_API_URL = process.env.JUDGE0_API_URL
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY

if (!JUDGE0_API_KEY) {
  console.warn('⚠️  JUDGE0_API_KEY not set. Code execution will fail.')
}

export const executeCode = async (code, languageId, stdin = '') => {
  try {
    // Check if API key is configured
    if (!JUDGE0_API_KEY || JUDGE0_API_KEY === 'your_judge0_api_key_here') {
      // Fallback: Mock execution for testing
      console.warn('⚠️  Judge0 API not configured. Using mock execution.')
      
      return {
        success: true,
        output: 'Code executed successfully (mock)\n\nNote: Set JUDGE0_API_KEY in .env for real code execution',
        status: 'Accepted (Mock)',
        statusId: 3,
      }
    }

    // Submit code for execution
    const submitResponse = await axios.post(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`,
      {
        source_code: code,
        language_id: languageId,
        stdin: stdin,
      },
      {
        headers: {
          'x-rapidapi-key': JUDGE0_API_KEY,
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      }
    )

    const submissionId = submitResponse.data.token

    // Poll for result (10 second timeout, 500ms interval)
    let result = null
    let attempts = 0
    const maxAttempts = 20 // 20 * 500ms = 10 seconds

    while (attempts < maxAttempts) {
      const resultResponse = await axios.get(
        `${JUDGE0_API_URL}/submissions/${submissionId}?base64_encoded=false`,
        {
          headers: {
            'x-rapidapi-key': JUDGE0_API_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          },
        }
      )

      result = resultResponse.data

      // Check if execution is complete
      if (result.status.id > 2) {
        break
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      attempts++
    }

    if (!result) {
      return {
        success: false,
        output: 'Execution timeout (>10s)',
        status: 'Timeout',
      }
    }

    // Format result
    const statusId = result.status.id
    const isSuccess = statusId === 3 // Status: "Accepted"
    const isWrongAnswer = statusId === 4
    const isCompilationError = statusId === 6
    const isRuntimeError = statusId === 11

    return {
      success: isSuccess,
      output: result.stdout || result.stderr || result.compile_output || '',
      status: result.status.description,
      statusId: statusId,
      error: result.stderr || result.compile_output || '',
    }
  } catch (error) {
    console.error('Judge0 execution error:', error.message)
    return {
      success: false,
      output: '',
      status: 'Error',
      error: error.message,
    }
  }
}
