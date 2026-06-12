import styles from './SessionCounter.module.css'

interface SessionCounterProps {
  sessionCount: number
}

export function SessionCounter({ sessionCount }: SessionCounterProps) {
  return (
    <div className={styles.counter}>
      <span className={styles.count}>{sessionCount}</span>
      <span className={styles.label}>pomodoro{sessionCount !== 1 ? 's' : ''} completed</span>
    </div>
  )
}
