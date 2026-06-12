# Pomodoro Timer MVP — Use Cases

> Bridge between Gherkin specs and technical design.
> Describes user interaction purely by intent and behavior, without coupling to UI elements.

---

## UC-01: Start a focus session

| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | Timer is in idle state showing configured duration (25:00) |
| **Main flow** | 1. User signals intent to start working<br>2. System starts countdown from the configured duration |
| **Postcondition** | Timer is in running state |
| **Alternative flows** | — |

---

## UC-02: Pause the current session

| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | Timer is in running state |
| **Main flow** | 1. User signals intent to interrupt the session<br>2. System stops the countdown and preserves remaining time |
| **Postcondition** | Timer is in paused state with remaining time preserved |
| **Alternative flows** | — |

---

## UC-03: Resume the paused session

| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | Timer is in paused state |
| **Main flow** | 1. User signals intent to resume the session<br>2. System resumes countdown from the preserved remaining time |
| **Postcondition** | Timer is in running state |
| **Alternative flows** | — |

---

## UC-04: Cancel the current session

| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | Timer is in any state (idle, running, paused) |
| **Main flow** | 1. User signals intent to reset completely<br>2. System restores timer to initial state: work mode, 25:00, 0 completed sessions |
| **Postcondition** | Timer is in idle state with default values |
| **Alternative flows** | — |

---

## UC-05: Complete a work session

| Field | Value |
|-------|-------|
| **Actor** | System (automatic) |
| **Precondition** | Timer is in running state in work mode, countdown reaches 0 |
| **Main flow** | 1. System detects remaining time is 0<br>2. System increments completed sessions counter<br>3. System switches to break mode with corresponding break duration<br>4. System stops countdown and waits for user action |
| **Postcondition** | Timer is in idle state in break mode (short: 5:00 or long: 15:00), sessions incremented |
| **Alternative flows** | — |

---

## UC-06: Complete a break session

| Field | Value |
|-------|-------|
| **Actor** | System (automatic) |
| **Precondition** | Timer is in running state in break mode, countdown reaches 0 |
| **Main flow** | 1. System detects remaining time is 0<br>2. System switches to work mode with configured work duration<br>3. System stops countdown and waits for user action<br>4. Session counter is NOT incremented |
| **Postcondition** | Timer is in idle state in work mode (25:00), sessions unchanged |
| **Alternative flows** | — |

---

## UC-07: Receive long break after 4 pomodoros

| Field | Value |
|-------|-------|
| **Actor** | System (automatic, deterministic) |
| **Precondition** | Timer completes a work session and the session counter is a multiple of 4 |
| **Main flow** | 1. System detects the completed session is the 4th, 8th, 12th...<br>2. System assigns long break duration (15:00) instead of short break (5:00) |
| **Postcondition** | Timer is in break mode with 15:00 duration |
| **Alternative flows** | If counter is NOT a multiple of 4 → short break (5:00) is assigned |

---

## UC-08: View completed sessions

| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | Timer is in any state |
| **Main flow** | 1. User wants to know how many pomodoros completed in the current session<br>2. System displays the number of completed work sessions |
| **Postcondition** | — (read-only query) |
| **Alternative flows** | — |

---

## UC-09: View remaining time

| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | Timer is in any state |
| **Main flow** | 1. User wants to know how much time is left<br>2. System displays remaining time in MM:SS format |
| **Postcondition** | — (read-only query) |
| **Alternative flows** | — |

---

## UC-10: Distinguish between work and break

| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | Timer is in any state |
| **Main flow** | 1. User wants to quickly identify current mode<br>2. System presents a clear visual distinction between work mode and break mode |
| **Postcondition** | — (visual perception) |
| **Alternative flows** | — |

---

## UC-11: Attempt to start when already running (safeguard)

| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | Timer is in running state |
| **Main flow** | 1. User signals intent to start (by confusion or repeated action)<br>2. System ignores the action — state remains unchanged |
| **Postcondition** | Timer stays in running state uninterrupted |
| **Alternative flows** | — |

---

## UC-12: Attempt to pause when idle (safeguard)

| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | Timer is in idle state |
| **Main flow** | 1. User signals intent to pause (by confusion)<br>2. System ignores the action — state remains unchanged |
| **Postcondition** | Timer stays in idle state |
| **Alternative flows** | — |

---

## Trazability Map

| Use Case | Capability | Related Gherkin Scenario |
|----------|------------|--------------------------|
| UC-01 | timer-lifecycle | START from idle |
| UC-02 | timer-lifecycle | PAUSE from running |
| UC-03 | timer-lifecycle | RESUME from paused |
| UC-04 | timer-lifecycle | RESET from any state |
| UC-05 | timer-lifecycle | Work→break auto-transition |
| UC-06 | timer-lifecycle | Break→work auto-transition |
| UC-07 | timer-lifecycle | Long break triggered / Short break |
| UC-08 | session-tracking | Session count rendered / Zero |
| UC-09 | timer-display | MM:SS formatting (full, partial, zero) |
| UC-10 | timer-display | Work mode / Break mode class |
| UC-11 | timer-lifecycle | START ignored when running |
| UC-12 | timer-lifecycle | PAUSE ignored when idle |
