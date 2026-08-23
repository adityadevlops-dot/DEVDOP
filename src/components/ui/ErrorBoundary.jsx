import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 text-center">
          <div className="p-8 bg-surface border border-accent-red/40 rounded-card max-w-md w-full shadow-2xl space-y-4">
            <h1 className="text-2xl font-bold text-accent-red">Something went wrong</h1>
            <p className="text-sm text-text-muted">
              An unexpected error occurred in the workspace.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 px-4 bg-accent-red hover:bg-accent-red-hover text-white text-sm font-medium rounded-button transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
