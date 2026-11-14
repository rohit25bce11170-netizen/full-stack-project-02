const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100 // limit each IP to 100 requests per windowMs
  },
  security: {
    validApiKey: process.env.API_KEY || 'decodelabs-secret-key-2026',
    adminApiKey: process.env.ADMIN_KEY || 'admin-super-secret-key-2026'
  }
};

module.exports = config;
