# Design: Pomodoro Timer MVP

## Technical Approach

Timer state machine via `useReducer` with two orthogonal axes (mode × status). Timer engine uses absolute time (`endTime - Date.now()`) for drift-proof counting. Pure presentational components with CSS Modules. Strict TDD in three layers: reducer (no timers), hook (fake timers), components (@testing-library/react).

## Architecture Decisions

### Decision: State management

| Option | Tradeoff | Decision |
|--------|----------|----------|
| useReducer | Zero dependencies, explicit transitions, invalid = no-op | ✅ Adopted |
| useState + callbacks | Related states decoupled, more bug-prone | ❌ |
| External lib (Zustand) | Overkill for 4 fields, extra dependency | ❌ |

### Decision: Timer engine

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `endTime - Date.now()` | Drift-proof, resists background tabs, testable with fakeTimers | ✅ Adopted |
| setInterval subtracting 200ms | Accumulates drift, desyncs in background | ❌ |

### Decision: Styling

| Option | Tradeoff | Decision |
|--------|----------|----------|
| CSS Modules | Zero runtime, scoped, Vite-native, no dependencies | ✅ Adopted |
| styled-components | Runtime cost, extra dependency | ❌ |
| Tailwind | Overkill for ~4 components, extra config | ❌ |

### Decision: Component pattern

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Container/Presentational | Hook isolated in container, pure testable components | ✅ Adopted |
| Hooks in each component | Logic scattered, more mocking in tests | ❌ |

## Data Flow

```
useTimer() hook
  │
  ├── useReducer(timerReducer, initialState)
  │     └── guards each action by current (mode × status)
  │
  ├── setInterval (200ms)
  │     └── dispatch({ type: 'TICK', remaining: max(0, endTime - Date.now()) })
  │
  └── returns: { state, start(), pause(), resume(), reset() }

TimerPage (container)
  ├── useTimer()
  ├── TimerDisplay       ← secondsRemaining, mode
  ├── Controls           ← status, action helpers
  └── SessionCounter     ← sessionCount
```

**Auto-transition flow (UC-05, UC-06):**

```
TICK(remaining=0) ──→ reducer detects remaining=0
                     ├── mode = work? → flip to break, sessionCount++
                     └── mode = break? → flip to work, sessionCount unchanged
                   ──→ status = idle (waits for manual user action)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/utils/constants.ts` | Create | Durations (WORK: 1500, SHORT_BREAK: 300, LONG_BREAK: 900), TimerMode, TimerStatus, TimerAction, TimerState types |
| `src/utils/timerReducer.ts` | Create | Pure reducer with state guards. TICK with remaining=0 triggers auto-transition. `getInitialState()` factory |
| `src/hooks/useTimer.ts` | Create | useReducer wrapper + setInterval with absolute endTime. Helper functions start/pause/resume/reset. Cleanup on unmount |
| `src/timer/TimerPage.tsx` | Create | Container consuming useTimer, rendering TimerDisplay, Controls, SessionCounter |
| `src/timer/TimerPage.module.css` | Create | Container layout styles |
| `src/timer/TimerDisplay.tsx` | Create | MM:SS display with className based on mode (work/break) |
| `src/timer/TimerDisplay.module.css` | Create | Work (red) and break (green/blue) visual styles |
| `src/timer/Controls.tsx` | Create | Contextual Start|Pause|Resume button + always-visible Reset |
| `src/timer/Controls.module.css` | Create | Button styles |
| `src/timer/SessionCounter.tsx` | Create | sessionCount display |
| `src/timer/SessionCounter.module.css` | Create | Counter styles |
| `src/App.tsx` | Modify | Replace Vite boilerplate with `<TimerPage />` |
| `src/App.css` | Modify | Clean up original scaffold styles |

## Interfaces / Contracts

```typescript
// src/utils/constants.ts
type TimerMode = 'work' | 'break'
type TimerStatus = 'idle' | 'running' | 'paused'

type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'TICK'; remaining: number }

interface TimerState {
  mode: TimerMode
  status: TimerStatus
  secondsRemaining: number
  sessionCount: number
}

// src/hooks/useTimer.ts
interface UseTimerReturn {
  state: TimerState
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
}
```

## Testing Strategy

| Layer | What to test | Approach |
|-------|-------------|----------|
| Unit (reducer) | Each action × every valid and invalid state, auto-transitions at 0, long break calculation | Pure reducer, direct calls, no timers |
| Unit (hook) | Initialization, start/pause/resume/reset dispatch, TICK loop, cleanup on unmount | `vi.useFakeTimers()`, `renderHook` |
| Integration (components) | TimerPage renders TimerDisplay + Controls + SessionCounter, buttons dispatch correct actions, MM:SS updates | `@testing-library/react` with mocked or real hook |

## Open Questions

None. All patterns are defined and validated in the Explore phase.
