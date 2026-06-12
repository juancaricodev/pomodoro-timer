import type { TimerStatus } from '../../utils/constants'
import styles from './Controls.module.css'

interface ControlsProps {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
}

export function Controls({ status, onStart, onPause, onResume, onReset }: ControlsProps) {
  const primaryAction = status === 'idle' ? onStart : status === 'running' ? onPause : onResume
  const primaryLabel = status === 'idle' ? 'Start' : status === 'running' ? 'Pause' : 'Resume'

  return (
    <div className={styles.controls}>
      <button className={styles.primary} onClick={primaryAction}>
        {primaryLabel}
      </button>
      <button className={styles.secondary} onClick={onReset}>
        Reset
      </button>
    </div>
  )
}
