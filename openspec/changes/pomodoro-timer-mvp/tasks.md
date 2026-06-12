# Tasks: Pomodoro Timer MVP

> Strict TDD: RED (failing test) → GREEN (make pass) per unit.

## Phase 1: Core State Machine

- [ ] 1.1 Create `src/utils/constants.ts` — TimerMode, TimerStatus, TimerAction, TimerState types, duration constants
- [ ] 1.2 Write failing tests for `timerReducer` — every action × valid/invalid state, auto-transitions, long break
- [ ] 1.3 Implement `src/utils/timerReducer.ts` — pure reducer with state guards, `getInitialState()`

## Phase 2: Timer Engine

- [ ] 2.1 Write failing tests for `useTimer` — init, start/pause/resume/reset dispatch, TICK loop, cleanup
- [ ] 2.2 Implement `src/hooks/useTimer.ts` — useReducer + setInterval with absolute endTime, helper functions

## Phase 3: Presentation Components

- [ ] 3.1 Build `TimerDisplay.tsx` + `TimerDisplay.module.css` + tests — MM:SS format, mode-based styling (UC-09, UC-10)
- [ ] 3.2 Build `Controls.tsx` + `Controls.module.css` + tests — contextual Start|Pause|Resume, always-visible Reset (UC-01..04, UC-11..12)
- [ ] 3.3 Build `SessionCounter.tsx` + `SessionCounter.module.css` + tests — session count display (UC-08)

## Phase 4: Integration

- [ ] 4.1 Build `TimerPage.tsx` + `TimerPage.module.css` + tests — container wiring useTimer → children
- [ ] 4.2 Modify `src/App.tsx` and `src/App.css` — mount TimerPage, remove Vite boilerplate

## Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| Phase 1 | 3 | Types + reducer (pure logic, no timers) |
| Phase 2 | 2 | Hook (timers, lifecycle) |
| Phase 3 | 3 | Presentational components |
| Phase 4 | 2 | Integration wiring |
| **Total** | **10** | |
