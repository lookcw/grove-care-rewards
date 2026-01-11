/**
 * Error reporting utility for sending frontend errors to backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ErrorInfo {
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
}

/**
 * Send error to backend for logging in Google Cloud Error Reporting
 */
export async function reportError(error: Error | ErrorEvent | string, additionalInfo?: Record<string, any>) {
  try {
    let errorInfo: ErrorInfo;

    if (error instanceof Error) {
      errorInfo = {
        message: error.message,
        stack: error.stack,
        url: window.location.href,
      };
    } else if (error instanceof ErrorEvent) {
      errorInfo = {
        message: error.message,
        stack: error.error?.stack,
        url: error.filename || window.location.href,
        line: error.lineno,
        column: error.colno,
      };
    } else {
      errorInfo = {
        message: String(error),
        url: window.location.href,
      };
    }

    // Add any additional context
    if (additionalInfo) {
      errorInfo = { ...errorInfo, ...additionalInfo };
    }

    // Send to backend
    const token = localStorage.getItem('token');
    if (!token) {
      // Can't report if user not authenticated
      console.error('Error occurred but cannot report (not authenticated):', errorInfo);
      return;
    }

    await fetch(`${API_URL}/api/log-error`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(errorInfo),
    });
  } catch (e) {
    // Silently fail - don't want error reporting to cause more errors
    console.error('Failed to report error:', e);
  }
}

/**
 * Set up global error handlers
 */
export function setupErrorReporting() {
  // Handle uncaught errors
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Uncaught error:', { message, source, lineno, colno, error });
    if (error) {
      reportError(error);
    } else {
      reportError(new Error(String(message)));
    }
    return false; // Let default handler run too
  };

  // Handle unhandled promise rejections
  window.onunhandledrejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (event.reason instanceof Error) {
      reportError(event.reason);
    } else {
      reportError(new Error(`Unhandled rejection: ${event.reason}`));
    }
  };
}
