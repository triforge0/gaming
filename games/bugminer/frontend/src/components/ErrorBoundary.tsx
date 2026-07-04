import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Bug Miner render error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#1a1208', color: '#fff8e7', padding: 32, fontFamily: 'Fredoka, sans-serif',
        }}>
          <div style={{ maxWidth: 520, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
            <h2 style={{ color: '#ffd700', marginBottom: 12 }}>Something went wrong</h2>
            <p style={{ color: '#c4b896', marginBottom: 16, fontSize: '0.9rem' }}>
              {this.state.error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #ffd700, #ff6b35)', fontWeight: 600,
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
