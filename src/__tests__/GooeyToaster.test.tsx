import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { GooeyToaster } from '../components/GooeyToaster'
import { _resetQueue, _getMostRecentActiveId } from '../gooey-toast'

vi.mock('sonner', () => ({
  toast: {
    custom: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: ({ children, ...props }: any) => (
    <div data-testid="sonner-toaster" {...props}>
      {children}
    </div>
  ),
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  animate: () => ({ stop: () => {} }),
}))

import { toast } from 'sonner'
import { gooeyToast } from '../gooey-toast'

describe('GooeyToaster', () => {
  it('renders without crashing', () => {
    const { container } = render(<GooeyToaster />)
    expect(container).toBeDefined()
  })

  it('renders with custom position', () => {
    const { container } = render(<GooeyToaster position="top-center" />)
    expect(container).toBeDefined()
  })

  it('renders with all props', () => {
    const { container } = render(
      <GooeyToaster
        position="top-right"
        duration={5000}
        gap={20}
        offset="32px"
        theme="dark"
      />
    )
    expect(container).toBeDefined()
  })
})

describe('GooeyToaster closeOnEscape', () => {
  const mockDismiss = toast.dismiss as ReturnType<typeof vi.fn>
  const mockCustom = toast.custom as ReturnType<typeof vi.fn>

  beforeEach(() => {
    _resetQueue()
    mockDismiss.mockClear()
    mockCustom.mockClear()
  })

  afterEach(() => {
    cleanup()
  })

  it('dismisses the most recent toast when Escape is pressed', () => {
    render(<GooeyToaster />)

    // Create a toast so there is an active ID
    gooeyToast('Hello')
    const toastId = _getMostRecentActiveId()
    expect(toastId).toBeDefined()

    mockDismiss.mockClear()
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(mockDismiss).toHaveBeenCalledWith(toastId)
  })

  it('does not dismiss when closeOnEscape is false', () => {
    render(<GooeyToaster closeOnEscape={false} />)

    gooeyToast('Hello')

    mockDismiss.mockClear()
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(mockDismiss).not.toHaveBeenCalled()
  })

  it('does nothing when Escape is pressed with no active toasts', () => {
    render(<GooeyToaster />)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(mockDismiss).not.toHaveBeenCalled()
  })

  it('does not dismiss on non-Escape keys', () => {
    render(<GooeyToaster />)

    gooeyToast('Hello')

    mockDismiss.mockClear()
    fireEvent.keyDown(document, { key: 'Enter' })

    expect(mockDismiss).not.toHaveBeenCalled()
  })
})
