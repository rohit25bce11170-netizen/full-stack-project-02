/**
 * Health & Pedagogical Demonstration Controller
 * Demonstrates server diagnostics and educational HTTP status code scenarios.
 */

const { sendSuccess, sendError } = require('../utils/apiResponse');
const AppError = require('../utils/appError');

/**
 * GET /api/health
 * Returns server diagnostics and operational status
 */
const getHealth = (req, res) => {
  const healthData = {
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  };

  return sendSuccess(res, 200, 'Server is running and healthy', healthData);
};

/**
 * GET /api/demo/status/:code
 * Explicit educational showcase demonstrating the exact HTTP status codes required by DecodeLabs Project 2:
 * 200, 201, 204, 400, 401, 403, 404, 429, 500
 */
const demonstrateStatusCode = (req, res, next) => {
  const code = parseInt(req.params.code, 10);

  switch (code) {
    case 200:
      return sendSuccess(res, 200, 'HTTP 200 OK demonstrated - standard successful retrieval', { code: 200 });
    case 201:
      return sendSuccess(res, 201, 'HTTP 201 Created demonstrated - resource created successfully', { code: 201 });
    case 204:
      return sendSuccess(res, 204, 'HTTP 204 No Content demonstrated');
    case 400:
      return sendError(res, 400, 'HTTP 400 Bad Request demonstrated', 'Client sent invalid syntax or violated business rules.');
    case 401:
      return sendError(res, 401, 'HTTP 401 Unauthorized demonstrated', 'Authentication credentials are missing or invalid.');
    case 403:
      return sendError(res, 403, 'HTTP 403 Forbidden demonstrated', 'Client is authenticated but lacks required authorization permissions.');
    case 404:
      return sendError(res, 404, 'HTTP 404 Not Found demonstrated', 'The requested resource or endpoint does not exist.');
    case 429:
      return sendError(res, 429, 'HTTP 429 Too Many Requests demonstrated', 'Client exceeded rate quota within time window.');
    case 500:
      // Trigger an actual unhandled error to demonstrate 500 error-handling middleware
      return next(new Error('Simulated unhandled internal server error for HTTP 500 demonstration.'));
    default:
      return sendError(res, 400, 'Invalid demonstration code requested', `Supported codes: 200, 201, 204, 400, 401, 403, 404, 429, 500`);
  }
};

module.exports = {
  getHealth,
  demonstrateStatusCode
};
