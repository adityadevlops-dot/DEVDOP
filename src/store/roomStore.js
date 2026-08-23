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

  setRoom: (roomCode, isHost = false, roomId = '', initialCode = null, initialLanguage = null) =>
    set((state) => ({
      roomCode,
      roomId,
      isHost,
      code: initialCode !== null && initialCode !== undefined ? initialCode : (state.roomCode === roomCode ? state.code : DEFAULT_CODE),
      language: initialLanguage || (state.roomCode === roomCode ? state.language : 'javascript'),
      participants: [],
    })),

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
        ...state.participants.filter((p) => String(p.id) !== String(participant.id)),
        participant,
      ],
    })),

  removeParticipant: (participantId) =>
    set((state) => ({
      participants: state.participants.filter((p) => String(p.id) !== String(participantId)),
    })),

  reset: () =>
    set({
      roomCode: '',
      roomId: '',
      language: 'javascript',
      code: DEFAULT_CODE,
      participants: [],
      isHost: false,
      output: '',
      isRunning: false,
    }),
}))
