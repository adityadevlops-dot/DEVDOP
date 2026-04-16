export const MOCK_SESSIONS = [
  {
    id: '1',
    roomCode: 'XK7P2Q',
    language: 'javascript',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    participants: ['You', 'Alice', 'Bob'],
    code: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}',
  },
  {
    id: '2',
    roomCode: 'MP9K1L',
    language: 'python',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    participants: ['You', 'Charlie'],
    code: 'def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[0]\n    return quicksort([x for x in arr[1:] if x < pivot]) + [pivot] + quicksort([x for x in arr[1:] if x >= pivot])',
  },
  {
    id: '3',
    roomCode: 'RZ3F8W',
    language: 'javascript',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    participants: ['You', 'Dana', 'Eve', 'Frank'],
    code: 'const mergeSortHelper = (arr) => {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  // ...\n}',
  },
]

export const MOCK_CHAT_MESSAGES = []

export const MOCK_PARTICIPANTS = [
  {
    id: 'you',
    username: 'You',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
    role: 'host',
    isOnline: true,
  },
  {
    id: 'alex-123',
    username: 'Alex',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    role: 'guest',
    isOnline: true,
  },
]
