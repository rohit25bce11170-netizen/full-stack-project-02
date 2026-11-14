/**
 * Master API Router
 * Aggregates all modular route handlers under the common /api prefix.
 */

const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const healthRoutes = require('./healthRoutes');
const securityRoutes = require('./securityRoutes');

// Root API Directory
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DecodeLabs Full Stack Project 2 - REST API is active',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      health: '/api/health',
      security: '/api/security',
      demonstration: '/api/demo/status/:code'
    }
  });
});

// Mount modular sub-routers
router.use('/users', userRoutes);
router.use('/security', securityRoutes);
router.use('/', healthRoutes);

module.exports = router;
