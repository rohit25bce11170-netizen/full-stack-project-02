/**
 * Security and Resilience Demonstration Routes
 * Explicitly tests Authentication (401), Authorization (403), and Rate Limiting (429).
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { demoStrictLimiter } = require('../middleware/rateLimiter');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/security/protected-user
 * Requires authentication (AuthN) - accessible to any valid key ('user' or 'admin').
 * Demonstrates HTTP 401 if missing or invalid key.
 */
router.get('/protected-user', authenticate, (req, res) => {
  return sendSuccess(res, 200, 'Authentication successful! You have accessed a protected route.', {
    user: req.auth
  });
});

/**
 * GET /api/security/protected-admin
 * Requires authentication (AuthN) + Authorization (AuthZ) with role 'admin'.
 * Demonstrates HTTP 401 if unauthenticated, and HTTP 403 Forbidden if role !== 'admin'.
 */
router.get('/protected-admin', authenticate, authorize('admin'), (req, res) => {
  return sendSuccess(res, 200, 'Authorization verified! Administrator privilege confirmed.', {
    adminAccess: true,
    user: req.auth
  });
});

/**
 * GET /api/security/rate-limit-test
 * Uses demoStrictLimiter (limit: 5 requests per 30s) to demonstrate HTTP 429 Too Many Requests.
 */
router.get('/rate-limit-test', demoStrictLimiter, (req, res) => {
  return sendSuccess(res, 200, 'Request processed within allowed rate limits.', {
    quotaInfo: 'Max 5 requests per 30 seconds for demonstration.'
  });
});

module.exports = router;
