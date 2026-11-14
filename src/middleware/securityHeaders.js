/**
 * HTTP Security Headers Middleware
 * Protects against MIME sniffing, clickjacking, XSS, and information leakage.
 */

const securityHeaders = (req, res, next) => {
  // Prevent MIME-type sniffing (CWE-79)
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent Clickjacking attacks (CWE-1021)
  res.setHeader('X-Frame-Options', 'DENY');

  // Modern browsers: disable buggy legacy XSS auditor
  res.setHeader('X-XSS-Protection', '0');

  // Restrict referrer information leakage
  res.setHeader('Referrer-Policy', 'no-referrer');

  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'");

  // Restrict browser feature access
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');

  // Strict Transport Security (HSTS)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};

module.exports = securityHeaders;
