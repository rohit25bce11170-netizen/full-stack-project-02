/**
 * Health and Demonstration Routes
 */

const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// GET /api/health - Server health and diagnostics
router.get('/health', healthController.getHealth);

// GET /api/demo/status/:code - Status code demonstration
router.get('/demo/status/:code', healthController.demonstrateStatusCode);

module.exports = router;
