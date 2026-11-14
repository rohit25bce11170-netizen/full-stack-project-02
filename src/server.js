/**
 * Server Initialization & Lifecycle Management
 * Handles graceful startup, port binding, and process-level error safety.
 */

const app = require('./app');
const config = require('./config/config');

// Catch synchronous uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]:', err);
  process.exit(1);
});

// Catch asynchronous unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]:', reason);
});

const server = app.listen(config.port, () => {
  console.log('====================================================');
  console.log(`  DecodeLabs Full Stack Project 2 - Backend API    `);
  console.log(`  Environment : ${config.nodeEnv}                 `);
  console.log(`  Server Port : ${config.port}                    `);
  console.log(`  API Base URL: http://localhost:${config.port}/api `);
  console.log('====================================================');
});

// Graceful shutdown handling
const handleGracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down HTTP server...`);
  server.close(() => {
    console.log('HTTP server closed cleanly. Process exiting.');
    process.exit(0);
  });

  // Force close if graceful shutdown takes too long
  setTimeout(() => {
    console.error('Forcefully terminating process after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

module.exports = server;
