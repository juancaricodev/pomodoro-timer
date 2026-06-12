import { useReducer, useEffect, useRef, useCallback } from 'react'
import { timerReducer, getInitialState } from '../utils/timerReducer'
import { TICK_INTERVAL_MS } from '../utils/constants'
import type { TimerState } from '../utils/constants'

export interface UseTimerReturn {
  state: TimerState
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
}

export function useTimer(): UseTimerReturn {
  const [state, dispatch] = useReducer(timerReducer, undefined, getInitialState)
  const endTimeRef = useRef(0)

  // Set up interval only when status transitions to 'running' (start or resume).
  // endTime is computed once from the current secondsRemaining (full duration on start,
  // preserved value on resume). The interval does NOT re-run on TICK dispatches —
  // it reads endTimeRef which stays fixed until pause/reset.
  useEffect(() => {
    if (state.status !== 'running') return

    endTimeRef.current = Date.now() + state.secondsRemaining * 1000

    const id = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000))
      dispatch({ type: 'TICK', remaining })
    }, TICK_INTERVAL_MS)

    return () => clearInterval(id)
  }, [state.status])

  const start = useCallback(() => {
    dispatch({ type: 'START' })
  }, [])

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' })
  }, [])

  const resume = useCallback(() => {
    dispatch({ type: 'RESUME' })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return { state, start, pause, resume, reset }
}
