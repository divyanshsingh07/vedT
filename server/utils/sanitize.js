/**
 * In production, do not expose internal error messages or stack traces to the client.
 */
export function sanitizeErrorMessage(message, fallback = 'An error occurred. Please try again.') {
  if (process.env.NODE_ENV === 'production') {
    return fallback;
  }
  return message || fallback;
}
