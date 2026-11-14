/**
 * Authentication and Authorization Middleware
 * Strictly separates AuthN (Who are you?) from AuthZ (What can you do?).
 * Demonstrates HTTP 401 (Unauthorized) and HTTP 403 (Forbidden).
 */

const crypto = require('crypto');
const AppError = require('../utils/appError');
const config = require('../config/config');

/**
 * Constant-time string comparison to prevent timing attacks (CWE-208)
 * @param {string} a 
 * @param {string} b 
 * @returns {boolean}
 */
const timingSafeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
};

/**
 * Authentication Middleware (AuthN)
 * Verifies identity through API Key or Bearer Token.
 * Rejects unauthenticated callers with HTTP 401 Unauthorized.
 */
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const authHeader = req.headers['authorization'];

  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  const credential = apiKey || token;

  if (!credential) {
    return next(new AppError('Authentication credentials are missing. Please provide x-api-key or Bearer token.', 401));
  }

  // Timing-safe validation against configured keys
  if (timingSafeCompare(credential, config.security.adminApiKey)) {
    req.auth = {
      authenticated: true,
      role: 'admin',
      identifier: 'admin-service-account'
    };
    return next();
  }

  if (timingSafeCompare(credential, config.security.validApiKey)) {
    req.auth = {
      authenticated: true,
      role: 'user',
      identifier: 'standard-client-account'
    };
    return next();
  }

  return next(new AppError('Invalid or expired authentication credentials.', 401));
};

/**
 * Authorization Middleware Factory (AuthZ)
 * Checks if the authenticated caller has the necessary privileges.
 * Rejects callers lacking necessary rights with HTTP 403 Forbidden.
 * @param  {...string} allowedRoles - Array of roles permitted (e.g. 'admin')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.auth || !req.auth.authenticated) {
      return next(new AppError('Authentication required before authorization check.', 401));
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return next(new AppError(`Forbidden: Access denied. Role '${req.auth.role}' lacks permission for this action. Required role: ${allowedRoles.join(' or ')}.`, 403));
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
