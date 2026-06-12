import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimerDisplay } from './TimerDisplay'

describe('TimerDisplay', () => {
  it('renders 1500s as "25:00"', () => {
    render(<TimerDisplay secondsRemaining={1500} mode="work" />)
    expect(screen.getByText('25:00')).toBeDefined()
  })

  it('renders 125s as "02:05"', () => {
    render(<TimerDisplay secondsRemaining={125} mode="work" />)
    expect(screen.getByText('02:05')).toBeDefined()
  })

  it('renders 0s as "00:00"', () => {
    render(<TimerDisplay secondsRemaining={0} mode="work" />)
    expect(screen.getByText('00:00')).toBeDefined()
  })

  it('applies work mode CSS class', () => {
    const { container } = render(<TimerDisplay secondsRemaining={1500} mode="work" />)
    const className = (container.firstChild as HTMLElement).className
    expect(className).toContain('work')
  })

  it('applies break mode CSS class', () => {
    const { container } = render(<TimerDisplay secondsRemaining={300} mode="break" />)
    const className = (container.firstChild as HTMLElement).className
    expect(className).toContain('break')
  })
})
