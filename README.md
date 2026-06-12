# Pomodoro Timer

A focused Pomodoro timer for structured deep-work sessions. Built with React 19, TypeScript 6, and Vite 8.

## Features

- **Timer lifecycle**: Start, pause, resume, and reset work/break sessions
- **Auto-transition**: Automatically switches between work (25min) and break (5min) modes
- **Long break**: Every 4th completed pomodoro awards a 15min long break
- **Session tracking**: Displays completed pomodoro count
- **Visual distinction**: Work mode (red) and break mode (green) with distinct styling
- **Drift-proof**: Absolute-time based timer engine (`endTime - Date.now()`) — accurate regardless of tab backgrounding

## Stack

| Layer | Technology |
|-------|-----------|
| Build | Vite 8 |
| UI | React 19 |
| Language | TypeScript 6 (strict) |
| Styling | CSS Modules |
| Testing | Vitest 3 + @testing-library/react + jsdom |
| State | useReducer (zero external dependencies) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |

## Architecture

```
src/
├── utils/
│   ├── constants.ts          # Types, durations, action definitions
│   └── timerReducer.ts       # Pure state machine (mode × status)
├── hooks/
│   └── useTimer.ts           # Timer engine with absolute-time countdown
├── timer/
│   ├── TimerDisplay/         # MM:SS display with mode-based styling
│   ├── Controls/             # Contextual Start/Pause/Resume + Reset
│   ├── SessionCounter/       # Completed pomodoros display
│   └── TimerPage/            # Container orchestrating the timer
├── test/
│   └── setup.ts              # Vitest + @testing-library/react setup
├── App.tsx                   # App root — mounts TimerPage
└── main.tsx                  # Entry point with React StrictMode
```

The timer uses a `useReducer` state machine with two orthogonal axes — `mode` (work | break) and `status` (idle | running | paused). Every invalid action is a no-op by design.

## Testing

```bash
npm test
```

52 tests across three layers:
- **Unit** — Pure reducer tests (26 tests, no timers)
- **Hook** — Timer engine with `vi.useFakeTimers()` (6 tests)
- **Integration** — Component interaction with `@testing-library/react` (20 tests)

## Use Cases

| # | Use Case | Actor |
|---|----------|-------|
| UC-01 | Start a focus session | User |
| UC-02 | Pause the current session | User |
| UC-03 | Resume the paused session | User |
| UC-04 | Cancel the current session | User |
| UC-05 | Complete a work session | System |
| UC-06 | Complete a break session | System |
| UC-07 | Receive long break after 4 pomodoros | System |
| UC-08 | View completed sessions | User |
| UC-09 | View remaining time | User |
| UC-10 | Distinguish between work and break | User |
| UC-11 | Attempt to start when already running | User (safeguard) |
| UC-12 | Attempt to pause when idle | User (safeguard) |

## Project Status

**MVP complete.** The timer is fully functional with core Pomodoro features. Future iterations may include sound notifications, customizable durations, persistence, and keyboard shortcuts.
