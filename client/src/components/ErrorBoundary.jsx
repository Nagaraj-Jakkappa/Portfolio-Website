import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service if desired
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center font-body">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-xl shadow-red-500/5">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-3">Something went wrong</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            We've encountered an unexpected error. Please refresh the page or return to the homepage to continue.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
            <a
              href="/"
              className="bg-navy-800 hover:bg-navy-700 text-slate-300 font-medium py-2.5 px-6 rounded-lg transition-colors border border-navy-700"
            >
              Back to Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
