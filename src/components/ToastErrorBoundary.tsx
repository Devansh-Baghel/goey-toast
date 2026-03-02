import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ToastErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[GooeyToast] Rendering error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}
