import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Controls } from './Controls'

describe('Controls', () => {
  it('shows Start and Reset when idle', () => {
    render(
      <Controls status="idle" onStart={() => {}} onPause={() => {}} onResume={() => {}} onReset={() => {}} />
    )
    expect(screen.getByText('Start')).toBeDefined()
    expect(screen.getByText('Reset')).toBeDefined()
  })

  it('shows Pause and Reset when running', () => {
    render(
      <Controls status="running" onStart={() => {}} onPause={() => {}} onResume={() => {}} onReset={() => {}} />
    )
    expect(screen.getByText('Pause')).toBeDefined()
    expect(screen.getByText('Reset')).toBeDefined()
  })

  it('shows Resume and Reset when paused', () => {
    render(
      <Controls status="paused" onStart={() => {}} onPause={() => {}} onResume={() => {}} onReset={() => {}} />
    )
    expect(screen.getByText('Resume')).toBeDefined()
    expect(screen.getByText('Reset')).toBeDefined()
  })

  it('calls onStart when Start is clicked', async () => {
    const onStart = vi.fn()
    render(
      <Controls status="idle" onStart={onStart} onPause={() => {}} onResume={() => {}} onReset={() => {}} />
    )
    await userEvent.click(screen.getByText('Start'))
    expect(onStart).toHaveBeenCalledOnce()
  })

  it('calls onPause when Pause is clicked', async () => {
    const onPause = vi.fn()
    render(
      <Controls status="running" onStart={() => {}} onPause={onPause} onResume={() => {}} onReset={() => {}} />
    )
    await userEvent.click(screen.getByText('Pause'))
    expect(onPause).toHaveBeenCalledOnce()
  })

  it('calls onResume when Resume is clicked', async () => {
    const onResume = vi.fn()
    render(
      <Controls status="paused" onStart={() => {}} onPause={() => {}} onResume={onResume} onReset={() => {}} />
    )
    await userEvent.click(screen.getByText('Resume'))
    expect(onResume).toHaveBeenCalledOnce()
  })

  it('calls onReset when Reset is clicked', async () => {
    const onReset = vi.fn()
    render(
      <Controls status="running" onStart={() => {}} onPause={() => {}} onResume={() => {}} onReset={onReset} />
    )
    await userEvent.click(screen.getByText('Reset'))
    expect(onReset).toHaveBeenCalledOnce()
  })
})
