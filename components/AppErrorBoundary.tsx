import React from 'react';

interface State {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/** Catches render errors and shows message + componentStack (and sends to debug ingest). */
export default class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState((s) => ({ ...s, errorInfo }));
    const payload = {
      sessionId: 'cb67aa',
      location: 'AppErrorBoundary.componentDidCatch',
      message: error.message,
      data: { stack: error.stack, componentStack: errorInfo.componentStack },
      timestamp: Date.now(),
      hypothesisId: 'ERROR_BOUNDARY',
    };
    fetch('http://127.0.0.1:7491/ingest/d0db9da5-030c-4ef0-a8bf-f9f6a978cafd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'cb67aa' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-stone-100 p-6 font-mono text-sm overflow-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-lg border border-red-200 p-4 shadow">
            <h1 className="text-red-600 font-bold mb-2">App error (caught)</h1>
            <pre className="whitespace-pre-wrap text-red-800 mb-4">{this.state.error.message}</pre>
            {this.state.error.stack && (
              <details className="mb-4">
                <summary className="cursor-pointer text-stone-500">Stack</summary>
                <pre className="whitespace-pre-wrap text-stone-600 mt-1 text-xs">{this.state.error.stack}</pre>
              </details>
            )}
            {this.state.errorInfo?.componentStack && (
              <details>
                <summary className="cursor-pointer text-stone-500">Component stack</summary>
                <pre className="whitespace-pre-wrap text-stone-600 mt-1 text-xs">{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
