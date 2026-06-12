import {
  WORK_DURATION,
  SHORT_BREAK_DURATION,
  LONG_BREAK_DURATION,
} from './constants'
import type { TimerState, TimerAction } from './constants'

export function getInitialState(): TimerState {
  return {
    mode: 'work',
    status: 'idle',
    secondsRemaining: WORK_DURATION,
    sessionCount: 0,
  }
}

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START': {
      if (state.status !== 'idle') return state
      return { ...state, status: 'running' }
    }

    case 'PAUSE': {
      if (state.status !== 'running') return state
      return { ...state, status: 'paused' }
    }

    case 'RESUME': {
      if (state.status !== 'paused') return state
      return { ...state, status: 'running' }
    }

    case 'RESET': {
      return getInitialState()
    }

    case 'TICK': {
      if (state.status !== 'running') return state
      if (action.remaining > 0) {
        return { ...state, secondsRemaining: action.remaining }
      }

      // remaining <= 0 → session complete
      if (state.mode === 'work') {
        const nextSessionCount = state.sessionCount + 1
        const breakDuration = nextSessionCount % 4 === 0
          ? LONG_BREAK_DURATION
          : SHORT_BREAK_DURATION
        return {
          mode: 'break',
          status: 'idle',
          secondsRemaining: breakDuration,
          sessionCount: nextSessionCount,
        }
      }

      // break → work
      return {
        mode: 'work',
        status: 'idle',
        secondsRemaining: WORK_DURATION,
        sessionCount: state.sessionCount,
      }
    }

    default:
      return state
  }
}
