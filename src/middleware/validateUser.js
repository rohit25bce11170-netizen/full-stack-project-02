/**
 * User Data Validation Middleware
 * Implements strict Syntactic and Structural Validation.
 * "Never trust the client" principle.
 * Refactored for clean modularity, DRY principles, and maintainability.
 */

const AppError = require('../utils/appError');

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;
const ALLOWED_ROLES = ['admin', 'user', 'manager'];
const ALLOWED_STATUSES = ['active', 'inactive'];
const ALLOWED_FIELDS = ['name', 'email', 'role', 'status'];
const MAX_EMAIL_LENGTH = 254; // RFC 5321 ceiling

/**
 * Validates user ID URL parameter
 */
const validateUserIdParam = (req, res, next) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return next(new AppError('Invalid resource ID. ID must be a positive integer.', 400));
  }

  next();
};

/**
 * Validates a single Name field
 * @param {any} name 
 * @param {boolean} isRequired 
 * @returns {string|null} Error description or null
 */
const validateNameField = (name, isRequired = false) => {
  if (name === undefined || name === null || name === '') {
    return isRequired ? 'Field "name" is required.' : null;
  }
  if (typeof name !== 'string') {
    return 'Field "name" must be a string.';
  }
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 50) {
    return 'Field "name" must be between 2 and 50 characters long.';
  }
  if (!NAME_REGEX.test(trimmed)) {
    return 'Field "name" contains invalid characters. Only letters, spaces, hyphens, and apostrophes are allowed.';
  }
  return null;
};

/**
 * Validates a single Email field
 * @param {any} email 
 * @param {boolean} isRequired 
 * @returns {string|null} Error description or null
 */
const validateEmailField = (email, isRequired = false) => {
  if (email === undefined || email === null || email === '') {
    return isRequired ? 'Field "email" is required.' : null;
  }
  if (typeof email !== 'string') {
    return 'Field "email" must be a string.';
  }
  const trimmed = email.trim();
  if (trimmed.length > MAX_EMAIL_LENGTH) {
    return `Field "email" exceeds maximum allowed length of ${MAX_EMAIL_LENGTH} characters.`;
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Field "email" must be a valid email address format (e.g., user@example.com).';
  }
  return null;
};

/**
 * Validates a single Role field
 * @param {any} role 
 * @returns {string|null} Error description or null
 */
const validateRoleField = (role) => {
  if (role === undefined) return null;
  if (typeof role !== 'string') {
    return 'Field "role" must be a string.';
  }
  if (!ALLOWED_ROLES.includes(role.toLowerCase())) {
    return `Field "role" must be one of: ${ALLOWED_ROLES.join(', ')}.`;
  }
  return null;
};

/**
 * Validates a single Status field
 * @param {any} status 
 * @returns {string|null} Error description or null
 */
const validateStatusField = (status) => {
  if (status === undefined) return null;
  if (typeof status !== 'string') {
    return 'Field "status" must be a string.';
  }
  if (!ALLOWED_STATUSES.includes(status.toLowerCase())) {
    return `Field "status" must be one of: ${ALLOWED_STATUSES.join(', ')}.`;
  }
  return null;
};

/**
 * Inspects payload object for unrecognized extra fields (Whitelisting check)
 * @param {Object} body 
 * @returns {string|null} Error description or null
 */
const checkUnknownFields = (body) => {
  const incoming = Object.keys(body);
  const unknown = incoming.filter(field => !ALLOWED_FIELDS.includes(field));
  if (unknown.length > 0) {
    return `Unrecognized field(s): ${unknown.join(', ')}. Allowed fields are: ${ALLOWED_FIELDS.join(', ')}`;
  }
  return null;
};

/**
 * Validates request payload for POST /api/users (Creation)
 */
const validateCreateUser = (req, res, next) => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
    return next(new AppError('Request body cannot be empty or malformed.', 400));
  }

  const errors = [];

  const unknownErr = checkUnknownFields(body);
  if (unknownErr) errors.push(unknownErr);

  const nameErr = validateNameField(body.name, true);
  if (nameErr) errors.push(nameErr);

  const emailErr = validateEmailField(body.email, true);
  if (emailErr) errors.push(emailErr);

  const roleErr = validateRoleField(body.role);
  if (roleErr) errors.push(roleErr);

  const statusErr = validateStatusField(body.status);
  if (statusErr) errors.push(statusErr);

  if (errors.length > 0) {
    return next(new AppError('Syntactic validation failed', 400, errors.length === 1 ? errors[0] : errors));
  }

  next();
};

/**
 * Validates request payload for PUT /api/users/:id (Update)
 */
const validateUpdateUser = (req, res, next) => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
    return next(new AppError('Request body cannot be empty for an update.', 400));
  }

  const errors = [];

  const unknownErr = checkUnknownFields(body);
  if (unknownErr) errors.push(unknownErr);

  const nameErr = validateNameField(body.name, false);
  if (nameErr) errors.push(nameErr);

  const emailErr = validateEmailField(body.email, false);
  if (emailErr) errors.push(emailErr);

  const roleErr = validateRoleField(body.role);
  if (roleErr) errors.push(roleErr);

  const statusErr = validateStatusField(body.status);
  if (statusErr) errors.push(statusErr);

  if (errors.length > 0) {
    return next(new AppError('Syntactic validation failed', 400, errors.length === 1 ? errors[0] : errors));
  }

  next();
};

module.exports = {
  validateUserIdParam,
  validateCreateUser,
  validateUpdateUser
};
