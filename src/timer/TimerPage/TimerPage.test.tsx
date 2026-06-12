import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { TimerPage } from './TimerPage'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('TimerPage', () => {
  it('renders TimerDisplay with initial time', () => {
    render(<TimerPage />)
    expect(screen.getByText('25:00')).toBeDefined()
  })

  it('renders Start and Reset when idle', () => {
    render(<TimerPage />)
    expect(screen.getByText('Start')).toBeDefined()
    expect(screen.getByText('Reset')).toBeDefined()
  })

  it('renders session counter at zero', () => {
    render(<TimerPage />)
    expect(screen.getByText('0')).toBeDefined()
  })

  it('starts countdown when Start is clicked', () => {
    render(<TimerPage />)

    fireEvent.click(screen.getByText('Start'))
    expect(screen.getByText('Pause')).toBeDefined()

    act(() => { vi.advanceTimersByTime(3000) })
    expect(screen.getByText('24:57')).toBeDefined()
  })

  it('pauses and resumes countdown', () => {
    render(<TimerPage />)

    fireEvent.click(screen.getByText('Start'))
    act(() => { vi.advanceTimersByTime(3000) })
    expect(screen.getByText('24:57')).toBeDefined()

    fireEvent.click(screen.getByText('Pause'))
    expect(screen.getByText('Resume')).toBeDefined()

    act(() => { vi.advanceTimersByTime(5000) })
    expect(screen.getByText('24:57')).toBeDefined()

    fireEvent.click(screen.getByText('Resume'))
    act(() => { vi.advanceTimersByTime(2000) })
    expect(screen.getByText('24:55')).toBeDefined()
  })

  it('resets to initial state when Reset is clicked', () => {
    render(<TimerPage />)

    fireEvent.click(screen.getByText('Start'))
    act(() => { vi.advanceTimersByTime(3000) })

    fireEvent.click(screen.getByText('Reset'))
    expect(screen.getByText('25:00')).toBeDefined()
    expect(screen.getByText('Start')).toBeDefined()
    expect(screen.getByText('0')).toBeDefined()
  })
})
