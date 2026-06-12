import type { TimerMode } from '../../utils/constants'
import styles from './TimerDisplay.module.css'

interface TimerDisplayProps {
  secondsRemaining: number
  mode: TimerMode
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function TimerDisplay({ secondsRemaining, mode }: TimerDisplayProps) {
  const modeClass = mode === 'work' ? styles.work : styles.break

  return (
    <div className={`${styles.display} ${modeClass}`}>
      {formatTime(secondsRemaining)}
    </div>
  )
}
