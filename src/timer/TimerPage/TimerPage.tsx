import { useTimer } from '../../hooks/useTimer'
import { TimerDisplay } from '../TimerDisplay/TimerDisplay'
import { Controls } from '../Controls/Controls'
import { SessionCounter } from '../SessionCounter/SessionCounter'
import styles from './TimerPage.module.css'

export function TimerPage() {
  const { state, start, pause, resume, reset } = useTimer()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Pomodoro Timer</h1>
      <TimerDisplay secondsRemaining={state.secondsRemaining} mode={state.mode} />
      <Controls
        status={state.status}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onReset={reset}
      />
      <SessionCounter sessionCount={state.sessionCount} />
    </div>
  )
}
