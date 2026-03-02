import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { ToastErrorBoundary } from '../components/ToastErrorBoundary'

function ThrowingComponent(): never {
  throw new Error('Test render error')
}

describe('ToastErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ToastErrorBoundary>
        <div>Hello</div>
      </ToastErrorBoundary>
    )
    expect(getByText('Hello')).toBeInTheDocument()
  })

  it('renders null when a child throws during rendering', () => {
    const { container } = render(
      <ToastErrorBoundary>
        <ThrowingComponent />
      </ToastErrorBoundary>
    )
    expect(container.innerHTML).toBe('')
  })

  it('logs the error in development', () => {
    render(
      <ToastErrorBoundary>
        <ThrowingComponent />
      </ToastErrorBoundary>
    )
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[GooeyToast] Rendering error:',
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    )
  })
})
