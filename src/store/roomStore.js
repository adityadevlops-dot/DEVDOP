import { create } from 'zustand'
import { DEFAULT_CODE } from '../utils/constants'

export const useRoomStore = create((set) => ({
  roomCode: '',
  roomId: '',
  language: 'javascript',
  code: DEFAULT_CODE,
  participants: [],
  isHost: false,
  output: '',
  isRunning: false,

  setRoom: (roomCode, isHost = false, roomId = '') =>
    set({
      roomCode,
      roomId,
      isHost,
      code: DEFAULT_CODE,
      participants: [], // Clear participants when setting a new room
    }),

  setCode: (code) =>
    set({
      code,
    }),

  setLanguage: (language) =>
    set({
      language,
    }),

  setOutput: (output) =>
    set({
      output,
    }),

  setIsRunning: (isRunning) =>
    set({
      isRunning,
    }),

  addParticipant: (participant) =>
    set((state) => ({
      participants: [
        ...state.participants.filter((p) => p.id !== participant.id),
        participant,
      ],
    })),

  removeParticipant: (participantId) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== participantId),
    })),

  reset: () =>
    set({
      roomCode: '',
      language: 'javascript',
      code: DEFAULT_CODE,
      participants: [],
      isHost: false,
      output: '',
      isRunning: false,
    }),
}))
