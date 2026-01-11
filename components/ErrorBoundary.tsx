import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white p-4 text-center font-sans">
          <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-xl max-w-md shadow-2xl backdrop-blur">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">System Failure</h1>
            <p className="text-gray-300 mb-6">
              The circuit logic encountered a critical error. 
              {this.state.error?.message && <span className="block mt-2 text-xs font-mono bg-black/30 p-2 rounded text-red-300">{this.state.error.message}</span>}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-bold transition-all w-full"
            >
              <RefreshCcw size={18} /> Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}