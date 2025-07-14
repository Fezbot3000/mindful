/**
 * Security utilities for input sanitization and error handling
 */

// Input sanitization
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove potential XSS patterns
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .trim();
}

// Sanitize HTML content while preserving basic formatting
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Allow only safe HTML tags
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'i', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const tagPattern = /<(\/?)([\w]+)([^>]*)>/g;
  
  return html.replace(tagPattern, (match, closing, tagName, attributes) => {
    const tag = tagName.toLowerCase();
    if (allowedTags.includes(tag)) {
      // Remove potentially dangerous attributes
      const safeAttributes = attributes
        .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
        .replace(/on\w+\s*=\s*'[^']*'/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, '');
      return `<${closing}${tag}${safeAttributes}>`;
    }
    return '';
  });
}

// Error message sanitization
export function sanitizeErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred';
  
  let message = '';
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'An unexpected error occurred';
  }
  
  // Map Firebase auth errors to user-friendly messages
  const errorMappings: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password must be at least 8 characters long',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/internal-error': 'Authentication service temporarily unavailable',
    'auth/invalid-credential': 'Invalid credentials provided',
    'auth/user-disabled': 'This account has been disabled',
    'auth/operation-not-allowed': 'This sign-in method is not enabled',
    'auth/popup-closed-by-user': 'Sign-in was cancelled',
    'auth/popup-blocked': 'Pop-up was blocked by your browser',
    'auth/cancelled-popup-request': 'Sign-in was cancelled',
    'auth/credential-already-in-use': 'This credential is already associated with another account',
    'permission-denied': 'You do not have permission to perform this action',
    'not-found': 'The requested resource was not found',
    'already-exists': 'The resource already exists',
    'failed-precondition': 'The operation was rejected due to system state',
    'out-of-range': 'The operation was attempted past the valid range',
    'unauthenticated': 'Authentication required',
    'unavailable': 'Service temporarily unavailable',
    'data-loss': 'Unrecoverable data loss or corruption',
    'invalid-argument': 'Invalid data provided',
    'deadline-exceeded': 'Operation timed out',
    'resource-exhausted': 'Quota exceeded',
    'aborted': 'Operation was aborted',
    'internal': 'Internal server error',
    'unimplemented': 'Feature not implemented',
    'unknown': 'Unknown error occurred'
  };
  
  // Check for specific error codes
  for (const [code, friendlyMessage] of Object.entries(errorMappings)) {
    if (message.includes(code)) {
      return friendlyMessage;
    }
  }
  
  // Generic error patterns
  if (message.includes('network') || message.includes('connection')) {
    return 'Network connection error. Please check your internet connection';
  }
  
  if (message.includes('timeout') || message.includes('deadline')) {
    return 'Operation timed out. Please try again';
  }
  
  if (message.includes('quota') || message.includes('limit')) {
    return 'Service limit reached. Please try again later';
  }
  
  if (message.includes('permission') || message.includes('unauthorized')) {
    return 'You do not have permission to perform this action';
  }
  
  if (message.includes('validation') || message.includes('invalid')) {
    return 'Please check your input and try again';
  }
  
  // Don't expose internal error details
  if (message.includes('firebase') || message.includes('internal') || message.includes('server')) {
    return 'Service temporarily unavailable. Please try again later';
  }
  
  // Fallback for unknown errors
  return 'An unexpected error occurred. Please try again';
}

// Secure logging function that doesn't expose sensitive data
export function secureLog(level: 'info' | 'warn' | 'error', message: string, data?: any) {
  // Only log in development or when explicitly enabled
  if (process.env.NODE_ENV !== 'development' && !process.env.ENABLE_LOGGING) {
    return;
  }
  
  const timestamp = new Date().toISOString();
  const logData = data ? sanitizeLogData(data) : undefined;
  
  switch (level) {
    case 'info':
      console.info(`[${timestamp}] INFO: ${message}`, logData);
      break;
    case 'warn':
      console.warn(`[${timestamp}] WARN: ${message}`, logData);
      break;
    case 'error':
      console.error(`[${timestamp}] ERROR: ${message}`, logData);
      break;
  }
}

// Sanitize log data to remove sensitive information
function sanitizeLogData(data: any): any {
  if (!data || typeof data !== 'object') return data;
  
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential', 'email', 'phone'];
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeLogData(item));
  }
  
  const sanitized: any = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeLogData(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

// Validate and sanitize JSON data
export function sanitizeJsonData(data: any): any {
  if (!data) return data;
  
  try {
    // Convert to string and back to remove any potential code injection
    const jsonString = JSON.stringify(data);
    const parsed = JSON.parse(jsonString);
    
    // Recursively sanitize string values
    return sanitizeObjectStrings(parsed);
  } catch (error) {
    secureLog('error', 'Failed to sanitize JSON data', { error });
    return {};
  }
}

// Recursively sanitize string values in objects
function sanitizeObjectStrings(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObjectStrings(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObjectStrings(value);
    }
    return sanitized;
  }
  
  return obj;
}

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(attempt => now - attempt < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }
  
  getRemainingAttempts(identifier: string): number {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    const recentAttempts = userAttempts.filter(attempt => now - attempt < this.windowMs);
    
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Create rate limiter instances
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const generalRateLimiter = new RateLimiter(10, 60 * 1000); // 10 attempts per minute 