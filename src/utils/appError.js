/**
 * Custom Operational Application Error class
 * Extends the native Error class with HTTP status code and operational flag.
 */
class AppError extends Error {
  /**
   * @param {string} message - Descriptive error message
   * @param {number} statusCode - HTTP status code (e.g., 400, 401, 403, 404, 429, 500)
   * @param {any} [details=null] - Optional detailed validation or context object
   */
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Marks errors we anticipate vs programming bugs
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
