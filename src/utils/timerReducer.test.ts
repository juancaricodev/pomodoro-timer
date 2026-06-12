import { describe, it, expect } from 'vitest'
import type { TimerState } from './constants'
import { timerReducer, getInitialState } from './timerReducer'

describe('getInitialState', () => {
  it('returns work mode, idle, 1500s, 0 sessions', () => {
    const state = getInitialState()
    expect(state).toEqual<TimerState>({
      mode: 'work',
      status: 'idle',
      secondsRemaining: 1500,
      sessionCount: 0,
    })
  })
})

describe('timerReducer', () => {
  const workDuration = 1500
  const shortBreak = 300
  const longBreak = 900

  // ── START ──────────────────────────────────────────

  describe('START', () => {
    it('transitions from idle to running', () => {
      const state = getInitialState()
      const next = timerReducer(state, { type: 'START' })
      expect(next.status).toBe('running')
      expect(next.secondsRemaining).toBe(workDuration)
    })

    it('is ignored when already running', () => {
      const state: TimerState = { mode: 'work', status: 'running', secondsRemaining: 1000, sessionCount: 0 }
      const next = timerReducer(state, { type: 'START' })
      expect(next).toEqual(state)
    })

    it('is ignored when paused', () => {
      const state: TimerState = { mode: 'work', status: 'paused', secondsRemaining: 800, sessionCount: 0 }
      const next = timerReducer(state, { type: 'START' })
      expect(next).toEqual(state)
    })
  })

  // ── PAUSE ──────────────────────────────────────────

  describe('PAUSE', () => {
    it('transitions from running to paused, preserves remaining', () => {
      const state: TimerState = { mode: 'work', status: 'running', secondsRemaining: 1200, sessionCount: 2 }
      const next = timerReducer(state, { type: 'PAUSE' })
      expect(next).toEqual<TimerState>({ mode: 'work', status: 'paused', secondsRemaining: 1200, sessionCount: 2 })
    })

    it('is ignored when idle', () => {
      const state = getInitialState()
      const next = timerReducer(state, { type: 'PAUSE' })
      expect(next).toEqual(state)
    })

    it('is ignored when paused', () => {
      const state: TimerState = { mode: 'work', status: 'paused', secondsRemaining: 500, sessionCount: 1 }
      const next = timerReducer(state, { type: 'PAUSE' })
      expect(next).toEqual(state)
    })
  })

  // ── RESUME ─────────────────────────────────────────

  describe('RESUME', () => {
    it('transitions from paused to running', () => {
      const state: TimerState = { mode: 'work', status: 'paused', secondsRemaining: 900, sessionCount: 3 }
      const next = timerReducer(state, { type: 'RESUME' })
      expect(next).toEqual<TimerState>({ mode: 'work', status: 'running', secondsRemaining: 900, sessionCount: 3 })
    })

    it('is ignored when idle', () => {
      const state = getInitialState()
      const next = timerReducer(state, { type: 'RESUME' })
      expect(next).toEqual(state)
    })

    it('is ignored when running', () => {
      const state: TimerState = { mode: 'work', status: 'running', secondsRemaining: 700, sessionCount: 0 }
      const next = timerReducer(state, { type: 'RESUME' })
      expect(next).toEqual(state)
    })
  })

  // ── RESET ──────────────────────────────────────────

  describe('RESET', () => {
    it('resets from running state', () => {
      const state: TimerState = { mode: 'work', status: 'running', secondsRemaining: 300, sessionCount: 4 }
      const next = timerReducer(state, { type: 'RESET' })
      expect(next).toEqual(getInitialState())
    })

    it('resets from paused state', () => {
      const state: TimerState = { mode: 'break', status: 'paused', secondsRemaining: 100, sessionCount: 7 }
      const next = timerReducer(state, { type: 'RESET' })
      expect(next).toEqual(getInitialState())
    })

    it('resets from idle state', () => {
      const state: TimerState = { mode: 'break', status: 'idle', secondsRemaining: shortBreak, sessionCount: 3 }
      const next = timerReducer(state, { type: 'RESET' })
      expect(next).toEqual(getInitialState())
    })
  })

  // ── TICK ───────────────────────────────────────────

  describe('TICK', () => {
    it('updates secondsRemaining when running', () => {
      const state: TimerState = { mode: 'work', status: 'running', secondsRemaining: 1000, sessionCount: 0 }
      const next = timerReducer(state, { type: 'TICK', remaining: 950 })
      expect(next.secondsRemaining).toBe(950)
      expect(next.mode).toBe('work')
      expect(next.status).toBe('running')
      expect(next.sessionCount).toBe(0)
    })

    it('is ignored when paused', () => {
      const state: TimerState = { mode: 'work', status: 'paused', secondsRemaining: 800, sessionCount: 0 }
      const next = timerReducer(state, { type: 'TICK', remaining: 700 })
      expect(next).toEqual(state)
    })

    it('is ignored when idle', () => {
      const state = getInitialState()
      const next = timerReducer(state, { type: 'TICK', remaining: 1400 })
      expect(next).toEqual(state)
    })

    it('triggers auto-transition when remaining is negative (overshot)', () => {
      const state: TimerState = { mode: 'work', status: 'running', secondsRemaining: 500, sessionCount: 0 }
      const next = timerReducer(state, { type: 'TICK', remaining: -1 })
      expect(next.mode).toBe('break')
      expect(next.status).toBe('idle')
      expect(next.sessionCount).toBe(1)
    })
  })

  // ── AUTO-TRANSITIONS (TICK with remaining=0) ──────

  describe('auto-transition at zero', () => {
    it('work→break on remaining=0 (short break)', () => {
      const state: TimerState = { mode: 'work', status: 'running', secondsRemaining: 1, sessionCount: 0 }
      const next = timerReducer(state, { type: 'TICK', remaining: 0 })
      expect(next).toEqual<TimerState>({ mode: 'break', status: 'idle', secondsRemaining: shortBreak, sessionCount: 1 })
    })

    it('break→work on remaining=0', () => {
      const state: TimerState = { mode: 'break', status: 'running', secondsRemaining: 10, sessionCount: 5 }
      const next = timerReducer(state, { type: 'TICK', remaining: 0 })
      expect(next).toEqual<TimerState>({ mode: 'work', status: 'idle', secondsRemaining: workDuration, sessionCount: 5 })
    })

    it('long break on 4th completed pomodoro', () => {
      // sessionCount=3 before transition → 4 after → multiple of 4 → long break
      const state: TimerState = { mode: 'work', status: 'running', secondsRemaining: 5, sessionCount: 3 }
      const next = timerReducer(state, { type: 'TICK', remaining: 0 })
      expect(next).toEqual<TimerState>({ mode: 'break', status: 'idle', secondsRemaining: longBreak, sessionCount: 4 })
    })

    it('short break on 1st completed pomodoro (not multiple of 4)', () => {
      const state: TimerState = { mode: 'work', status: 'running', secondsRemaining: 5, sessionCount: 0 }
      const next = timerReducer(state, { type: 'TICK', remaining: 0 })
      expect(next.secondsRemaining).toBe(shortBreak)
      expect(next.sessionCount).toBe(1)
    })

    it('short break on 5th pomodoro (not multiple of 4)', () => {
      const state: TimerState = { mode: 'work', status: 'running', secondsRemaining: 5, sessionCount: 4 }
      const next = timerReducer(state, { type: 'TICK', remaining: 0 })
      expect(next.secondsRemaining).toBe(shortBreak)
      expect(next.sessionCount).toBe(5)
    })
  })

  // ── SESSION COUNT ──────────────────────────────────

  describe('session count', () => {
    it('increments on work→break transition', () => {
      const state: TimerState = { mode: 'work', status: 'running', secondsRemaining: 3, sessionCount: 2 }
      const next = timerReducer(state, { type: 'TICK', remaining: 0 })
      expect(next.sessionCount).toBe(3)
    })

    it('does NOT increment on break→work transition', () => {
      const state: TimerState = { mode: 'break', status: 'running', secondsRemaining: 3, sessionCount: 5 }
      const next = timerReducer(state, { type: 'TICK', remaining: 0 })
      expect(next.sessionCount).toBe(5)
    })

    it('resets to 0 on RESET', () => {
      const state: TimerState = { mode: 'work', status: 'paused', secondsRemaining: 100, sessionCount: 10 }
      const next = timerReducer(state, { type: 'RESET' })
      expect(next.sessionCount).toBe(0)
    })
  })
})
