/**
 * Request Logger Middleware
 * Logs incoming HTTP method, URL, client IP, response time, and status code.
 */

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    // Formatting log message
    console.log(`[${timestamp}] ${method} ${originalUrl} -> ${statusCode} (${duration}ms) - IP: ${ip || 'unknown'}`);
  });

  next();
};

module.exports = requestLogger;
