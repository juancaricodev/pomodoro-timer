import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTimer } from './useTimer'
import { TICK_INTERVAL_MS, WORK_DURATION } from '../utils/constants'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useTimer', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useTimer())
    expect(result.current.state).toMatchObject({
      mode: 'work',
      status: 'idle',
      secondsRemaining: WORK_DURATION,
      sessionCount: 0,
    })
  })

  it('start() transitions to running and begins countdown', () => {
    const { result } = renderHook(() => useTimer())

    act(() => { result.current.start() })
    expect(result.current.state.status).toBe('running')

    // Advance one tick
    act(() => { vi.advanceTimersByTime(TICK_INTERVAL_MS) })
    expect(result.current.state.secondsRemaining).toBe(WORK_DURATION - 1)
  })

  it('pause() stops the countdown', () => {
    const { result } = renderHook(() => useTimer())

    act(() => { result.current.start() })
    act(() => { vi.advanceTimersByTime(TICK_INTERVAL_MS * 3) })
    const pausedAt = result.current.state.secondsRemaining

    act(() => { result.current.pause() })
    expect(result.current.state.status).toBe('paused')

    // Advance time — secondsRemaining should NOT change
    act(() => { vi.advanceTimersByTime(TICK_INTERVAL_MS * 5) })
    expect(result.current.state.secondsRemaining).toBe(pausedAt)
  })

  it('resume() continues countdown from preserved time', () => {
    const { result } = renderHook(() => useTimer())

    act(() => { result.current.start() })
    act(() => { vi.advanceTimersByTime(TICK_INTERVAL_MS * 3) })
    act(() => { result.current.pause() })
    const pausedAt = result.current.state.secondsRemaining

    act(() => { result.current.resume() })
    expect(result.current.state.status).toBe('running')
    expect(result.current.state.secondsRemaining).toBe(pausedAt)

    // Advance one more tick — should decrease
    act(() => { vi.advanceTimersByTime(TICK_INTERVAL_MS) })
    expect(result.current.state.secondsRemaining).toBe(pausedAt - 1)
  })

  it('reset() returns to initial state and stops timer', () => {
    const { result } = renderHook(() => useTimer())

    act(() => { result.current.start() })
    act(() => { vi.advanceTimersByTime(TICK_INTERVAL_MS * 3) })

    act(() => { result.current.reset() })
    expect(result.current.state).toMatchObject({
      mode: 'work',
      status: 'idle',
      secondsRemaining: WORK_DURATION,
      sessionCount: 0,
    })

    // No more ticks after reset
    act(() => { vi.advanceTimersByTime(TICK_INTERVAL_MS * 3) })
    expect(result.current.state.secondsRemaining).toBe(WORK_DURATION)
  })

  it('cleans up interval on unmount', () => {
    const { result, unmount } = renderHook(() => useTimer())

    act(() => { result.current.start() })
    expect(result.current.state.status).toBe('running')

    unmount()

    // Should not throw — interval was cleaned up
    act(() => { vi.advanceTimersByTime(TICK_INTERVAL_MS) })
  })
})
