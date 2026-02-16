import React from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV !== 'production') {
            console.error('Error caught by boundary:', error, errorInfo);
        }

        this.setState({
            error,
            errorInfo
        });

        // TODO: Send to error monitoring service (Sentry, etc.)
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background-light  flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <div className="bg-white  rounded-2xl shadow-xl p-8 text-center">
                            {/* Error Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="bg-red-50  rounded-full p-4">
                                    <span className="material-symbols-outlined text-red-600  text-5xl">
                                        error
                                    </span>
                                </div>
                            </div>

                            {/* Error Message */}
                            <h1 className="text-2xl font-bold text-text-dark  mb-3">
                                Something went wrong
                            </h1>
                            <p className="text-gray-600  mb-6">
                                We're sorry, but something unexpected happened. The error has been logged and we'll look into it.
                            </p>

                            {/* Error Details (Development Only) */}
                            {process.env.NODE_ENV !== 'production' && this.state.error && (
                                <div className="mb-6 text-left">
                                    <details className="bg-red-50  rounded-lg p-4 text-sm">
                                        <summary className="cursor-pointer font-semibold text-red-600  mb-2">
                                            Error Details (Development Only)
                                        </summary>
                                        <div className="text-red-800  font-mono text-xs overflow-auto">
                                            <p className="mb-2 font-bold">{this.state.error.toString()}</p>
                                            <pre className="whitespace-pre-wrap">
                                                {this.state.errorInfo?.componentStack}
                                            </pre>
                                        </div>
                                    </details>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={this.handleReset}
                                    className="w-full btn-primary"
                                >
                                    Go to Home
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full btn-outline"
                                >
                                    Reload Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
