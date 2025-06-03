# Logging Policy for brain9ai

## Overview

This document outlines our approach to logging in the brain9ai web application, particularly focusing on how we handle sensitive information in production environments.

## Why We Need Safe Logging

Console logs can expose sensitive user data in production environments through:
- Browser dev tools
- Error reporting services
- Server logs
- Monitoring systems

To protect our users' privacy and maintain security, we've implemented a safe logging approach.

## Using the Safe Logger

We've created a `logger` utility that automatically handles environment-specific logging behavior. Always use this instead of direct `console.log` calls:

```typescript
// ❌ AVOID: Direct console logging
console.log('User data:', userData);

// ✅ USE: Safe logging utility
import logger from '../utils/logger';
logger.log('User data:', userData);  // Only logs in development
logger.event('user_login', { userId: 123 });  // Safe for all environments
```

## Logger Methods

The logger provides the following methods:

- `logger.log()` - Dev-only logging, suppressed in production
- `logger.info()` - Dev-only info logging, suppressed in production
- `logger.debug()` - Dev-only debug logging, suppressed in production
- `logger.warn()` - Warning logging (reduced details in production)
- `logger.error()` - Error logging (sanitized in production)
- `logger.event()` - Safe event logging for all environments (sensitive data redacted)

## Sensitive Data

The following types of data are considered sensitive and should never be directly logged:
- User emails, names, phone numbers
- Passwords or credentials
- Authentication tokens
- Personal information (addresses, etc.)
- Payment information
- API keys or secrets

## ESLint Rules

We've added ESLint rules to detect direct console.log usage:

```json
"no-console": ["warn", { "allow": ["warn", "error"] }]
```

This will warn about direct console.log, info, and debug usages, while still allowing warnings and errors.

## Best Practices

1. Always use the logger utility instead of direct console methods
2. Avoid logging sensitive data entirely when possible
3. Use logger.event() for important application events that need tracking
4. Only log the minimum information needed for debugging
5. Use structured logging where possible (objects with clear field names)
6. Consider what information is truly needed in production logs

## Implementation Details

The logger automatically detects the environment and adjusts logging behavior:
- Development: Full detailed logs for debugging
- Production: Minimal sanitized logs for critical issues

By following these guidelines, we protect user privacy while maintaining the ability to debug issues. 