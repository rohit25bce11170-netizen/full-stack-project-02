/**
 * Centralized Error-Handling Middleware
 * Intercepts all synchronous and asynchronous errors.
 * Ensures strict JSON response contract and security compliance.
 */

const { sendError } = require('../utils/apiResponse');
const config = require('../config/config');

const errorHandler = (err, req, res, next) => {
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle malformed JSON body from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(
      res,
      400,
      'Malformed JSON request',
      'The request body contains invalid JSON syntax. Please verify JSON format and quotes.'
    );
  }

  // Handle request payload exceeding size limits (HTTP 413 Payload Too Large)
  if (err.type === 'entity.too.large' || err.status === 413 || err.statusCode === 413) {
    return sendError(
      res,
      413,
      'Payload Too Large',
      `Request body exceeds the maximum permitted size limit of ${err.limit ? Math.round(err.limit / 1024) + 'KB' : '10KB'}.`
    );
  }

  // Handle operational AppError instances
  if (err.isOperational) {
    return sendError(
      res,
      err.statusCode,
      err.message,
      err.details || err.message
    );
  }

  // Log unexpected errors for debugging on server console
  console.error('[CRITICAL UNHANDLED ERROR]:', err);

  // For unexpected errors in production, hide stack trace and internal leaks
  const isProduction = config.nodeEnv === 'production';
  let errorMessage = isProduction
    ? 'An unexpected internal server error occurred.'
    : err.message || 'Internal server error';

  // Sanitize path disclosure in error messages (CWE-209 / CWE-497)
  if (typeof errorMessage === 'string') {
    errorMessage = errorMessage.replace(/([a-zA-Z]:\\[^\s,:]+|\/(?:var|etc|usr|home|tmp|opt)[^\s,:]+)/g, '[REDACTED_SYSTEM_PATH]');
  }

  return sendError(
    res,
    500,
    'Internal Server Error',
    errorMessage
  );
};

module.exports = errorHandler;
