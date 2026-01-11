# Google Cloud Error Reporting Setup

This document explains the error reporting setup for the Referral App.

## What Was Added

### Backend (Python/FastAPI)

1. **New Dependencies** (`requirements.txt`):
   - `google-cloud-logging==3.12.0` - For Cloud Logging integration
   - `google-cloud-error-reporting==1.10.0` - For Error Reporting

2. **Logging Configuration** (`app/main.py`):
   - Automatic Cloud Logging setup for staging/production (when `ENVIRONMENT != "local"`)
   - Structured logging with context (URL, method, client info)
   - Global exception handler that catches all unhandled exceptions
   - Startup event logging

3. **Frontend Error Endpoint** (`/api/log-error`):
   - POST endpoint for frontend to report JavaScript errors
   - Includes user context (user_id, email)
   - Requires authentication

### Frontend (React/TypeScript)

1. **Error Reporting Utility** (`errorReporting.ts`):
   - Global error handlers (`window.onerror`, `window.onunhandledrejection`)
   - `reportError()` function to send errors to backend
   - Automatic error context collection (URL, line, column, stack trace)

2. **Error Boundary** (`ErrorBoundary.tsx`):
   - React Error Boundary component to catch rendering errors
   - User-friendly error UI with reload button
   - Automatic error reporting to backend

3. **Setup** (`main.tsx`):
   - Global error handlers initialized on app startup
   - App wrapped in ErrorBoundary

## How It Works

### Backend Errors
- All unhandled exceptions are caught by the global exception handler
- Errors are logged with `ERROR` severity, which automatically appears in Google Cloud Error Reporting
- Includes full stack traces and request context

### Frontend Errors
1. **React Rendering Errors**: Caught by ErrorBoundary → sent to backend → logged to Cloud
2. **Uncaught JavaScript Errors**: Caught by `window.onerror` → sent to backend → logged to Cloud
3. **Unhandled Promise Rejections**: Caught by `window.onunhandledrejection` → sent to backend → logged to Cloud

## Viewing Errors in Google Cloud Console

After deployment:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `grove-health-staging`
3. Navigate to **Operations** > **Error Reporting**
4. You'll see all errors grouped by error message with:
   - Stack traces
   - Occurrence counts
   - First and last seen timestamps
   - Context (URL, user info, etc.)

## Additional Logging Best Practices

You can add more structured logging throughout your code:

```python
# Example: Log important operations
logger.info(f"User {user.id} created referral {referral.id}")

# Example: Log warnings
logger.warning(f"Invalid provider_id attempted: {provider_id}")

# Example: Log errors with context
try:
    result = await some_operation()
except Exception as e:
    logger.error(f"Operation failed for user {user.id}", exc_info=True)
    raise
```

## Log Levels

- `ERROR`: Appears in Error Reporting (use for exceptions)
- `WARNING`: Logged but not in Error Reporting
- `INFO`: General information (startup, important operations)
- `DEBUG`: Detailed debugging info (usually disabled in production)

## Testing Error Reporting

### Test Backend Errors
```bash
# Create a test endpoint that throws an error
curl https://your-app.appspot.com/api/some-endpoint-that-errors
```

### Test Frontend Errors
```javascript
// In browser console:
throw new Error("Test error from frontend")
```

Both should appear in Google Cloud Error Reporting within a few minutes.

## Important Notes

1. **Local Development**: Error reporting to Cloud is disabled when `ENVIRONMENT=local`
2. **Authentication**: Frontend errors only logged for authenticated users
3. **Privacy**: Be careful not to log sensitive user data in error messages
4. **Cost**: Cloud Logging and Error Reporting have free tiers, but monitor usage

## Deployment

After these changes, deploy with:
```bash
npm run deploy
```

The new logging configuration will automatically activate in your App Engine environment.
