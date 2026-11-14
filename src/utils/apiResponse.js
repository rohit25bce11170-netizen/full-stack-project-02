/**
 * Standardized API Response Utilities
 * Ensures predictable and uniform JSON contract across all endpoints.
 */

/**
 * Send a standardized success JSON response
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code (200, 201, 204, etc.)
 * @param {string} message - Human-readable success message
 * @param {any} [data=null] - Payload object or array
 */
const sendSuccess = (res, statusCode, message, data = null) => {
  if (statusCode === 204) {
    return res.status(204).send();
  }

  const response = {
    success: true,
    message
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a standardized error JSON response
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code (400, 401, 403, 404, 429, 500)
 * @param {string} message - High-level error summary
 * @param {any} [error=null] - Specific error description or validation details
 */
const sendError = (res, statusCode, message, error = null) => {
  const response = {
    success: false,
    message
  };

  if (error !== null && error !== undefined) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError
};
