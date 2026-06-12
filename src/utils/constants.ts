export const WORK_DURATION = 1500
export const SHORT_BREAK_DURATION = 300
export const LONG_BREAK_DURATION = 900
export const TICK_INTERVAL_MS = 200

export type TimerMode = 'work' | 'break'
export type TimerStatus = 'idle' | 'running' | 'paused'

export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'TICK'; remaining: number }

export interface TimerState {
  mode: TimerMode
  status: TimerStatus
  secondsRemaining: number
  sessionCount: number
}
