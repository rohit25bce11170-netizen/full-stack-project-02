/**
 * Express Application Configuration
 * Sets up middleware pipeline, API routing, and centralized error handling.
 */

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const securityHeaders = require('./middleware/securityHeaders');
const { apiLimiter } = require('./middleware/rateLimiter');
const { sendError } = require('./utils/apiResponse');

const app = express();

// 1. Hardening: Disable X-Powered-By header to prevent technology fingerprinting
app.disable('x-powered-by');

// 2. HTTP Security Headers (nosniff, X-Frame-Options, CSP, etc.)
app.use(securityHeaders);

// 3. CORS configuration restricting allowed methods and headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'Prefer']
}));

// 4. Request body parsing with strict payload size limits (DoS resilience)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 3. Custom request logging
app.use(requestLogger);

// 4. Rate limiting on API routes
app.use('/api', apiLimiter);

// 5. Root status check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DecodeLabs Full Stack Project 2 - Backend REST API is running',
    documentation: '/api/health',
    endpoints: {
      users: '/api/users',
      health: '/api/health',
      security: '/api/security',
      demonstration: '/api/demo/status/:code'
    }
  });
});

// 6. Mount modular API routes
app.use('/api', apiRoutes);

// 7. Catch-all route for undefined endpoints (HTTP 404 Not Found)
app.use((req, res) => {
  return sendError(
    res,
    404,
    'Endpoint Not Found',
    `Cannot ${req.method} ${req.originalUrl}. The requested endpoint does not exist on this server.`
  );
});

// 8. Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
