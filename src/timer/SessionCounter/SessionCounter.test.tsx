import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SessionCounter } from './SessionCounter'

describe('SessionCounter', () => {
  it('displays completed pomodoros count', () => {
    render(<SessionCounter sessionCount={3} />)
    expect(screen.getByText('3')).toBeDefined()
  })

  it('displays zero when no sessions completed', () => {
    render(<SessionCounter sessionCount={0} />)
    expect(screen.getByText('0')).toBeDefined()
  })
})
