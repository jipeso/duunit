import { Component, type ErrorInfo, type ReactNode } from 'react'
import Container from '@mui/material/Container'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public override render() {
    const { hasError } = this.state
    const { children } = this.props

    if (!hasError) return children

    return (
      <Container style={{ padding: '5em' }}>
        <h1>Something went wrong</h1>
      </Container>
    )
  }
}

export default ErrorBoundary
