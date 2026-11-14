/**
 * Rate Limiting Middleware
 * Protects server resilience and demonstrates HTTP 429 (Too Many Requests).
 */

const rateLimit = require('express-rate-limit');
const config = require('../config/config');

/**
 * Standard API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true, // Return RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded',
      error: 'Too many requests created from this IP, please try again after 15 minutes.'
    });
  }
});

/**
 * Strict demonstration rate limiter
 * Allows 5 requests per 30 seconds to clearly test and demonstrate HTTP 429.
 */
const demoStrictLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 5, // limit to 5 requests per 30s
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded',
      error: 'Demonstration rate limit exceeded (max 5 requests per 30 seconds). HTTP status 429 demonstrated.'
    });
  }
});

module.exports = {
  apiLimiter,
  demoStrictLimiter
};
