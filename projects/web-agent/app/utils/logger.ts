/**
 * A safe logging utility that prevents logging sensitive information in production
 * but allows full logging in development environments.
 */

// Check if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Create a logger object with methods that conditionally log based on environment
const logger = {
  /**
   * Safe console.log that only outputs in development
   */
  log: (...args: any[]) => {
    if (!isProduction) {
      console.log(...args);
    }
  },

  /**
   * Safe console.info that only outputs in development
   */
  info: (...args: any[]) => {
    if (!isProduction) {
      console.info(...args);
    }
  },

  /**
   * Safe console.debug that only outputs in development
   */
  debug: (...args: any[]) => {
    if (!isProduction) {
      console.debug(...args);
    }
  },

  /**
   * Safe console.warn that outputs a simplified message in production
   */
  warn: (...args: any[]) => {
    if (isProduction) {
      // In production, only log the message without details
      if (typeof args[0] === 'string') {
        console.warn('Warning occurred');
      } else {
        console.warn('Warning object');
      }
    } else {
      console.warn(...args);
    }
  },

  /**
   * Safe console.error that outputs a simplified message in production
   * Error logging is kept even in production for monitoring but with sanitized data
   */
  error: (...args: any[]) => {
    if (isProduction) {
      // In production, only log generic error information
      if (args[0] instanceof Error) {
        console.error(`Error: ${args[0].name}`);
      } else if (typeof args[0] === 'string') {
        // Extract just the error type without potential sensitive details
        const errorType = args[0].split(':')[0];
        console.error(`Error: ${errorType}`);
      } else {
        console.error('An error occurred');
      }
    } else {
      console.error(...args);
    }
  },

  /**
   * Log application events that are safe to log in any environment
   * Use this for important events that should be logged even in production
   */
  event: (eventName: string, eventData?: Record<string, any>) => {
    const safeData = eventData ? sanitizeData(eventData) : {};
    if (isProduction) {
      console.log(`EVENT: ${eventName}`);
    } else {
      console.log(`EVENT: ${eventName}`, safeData);
    }
  }
};

/**
 * Sanitize potentially sensitive data for production logging
 */
function sanitizeData(data: Record<string, any>): Record<string, any> {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'credential', 'email', 'phone', 'address', 'name'];
  const safeData = { ...data };
  
  // Recursively sanitize objects
  Object.keys(safeData).forEach(key => {
    // Check if the current key is sensitive
    const isSensitive = sensitiveKeys.some(sensitiveKey => 
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    );
    
    if (isSensitive) {
      // Mask sensitive data
      safeData[key] = '[REDACTED]';
    } else if (typeof safeData[key] === 'object' && safeData[key] !== null) {
      // Recursively sanitize nested objects
      safeData[key] = sanitizeData(safeData[key]);
    }
  });
  
  return safeData;
}

export default logger; 