/**
 * User Service - Business Logic Layer
 * Implements business rules and semantic validation.
 * Separates core logic from HTTP transport layer.
 */

const userStore = require('../data/userStore');
const AppError = require('../utils/appError');

class UserService {
  /**
   * Get all users with optional filtering
   * Sanitizes input to prevent HTTP parameter pollution (HPP)
   * @param {Object} query - Filtering query parameters
   * @returns {Array} List of users
   */
  async getAllUsers(query = {}) {
    // Sanitize parameters to guarantee single string values (prevent array parameter pollution)
    const sanitizeParam = (val) => {
      if (typeof val === 'string') return val.trim().slice(0, 100);
      if (Array.isArray(val) && typeof val[0] === 'string') return val[0].trim().slice(0, 100);
      return undefined;
    };

    const filters = {
      role: sanitizeParam(query.role),
      status: sanitizeParam(query.status),
      search: sanitizeParam(query.search)
    };
    return userStore.findAll(filters);
  }

  /**
   * Get single user by ID
   * @param {number} id - User ID
   * @returns {Object} User record
   */
  async getUserById(id) {
    const user = userStore.findById(id);
    if (!user) {
      throw new AppError(`User with ID ${id} not found.`, 404);
    }
    return user;
  }

  /**
   * Create new user with semantic uniqueness validation
   * @param {Object} userData - User creation attributes
   * @returns {Object} Created user record
   */
  async createUser(userData) {
    // Semantic Validation: Email uniqueness check
    const existing = userStore.findByEmail(userData.email);
    if (existing) {
      throw new AppError(`A user with email '${userData.email}' already exists. Email must be unique.`, 400);
    }

    return userStore.create(userData);
  }

  /**
   * Update existing user with semantic validation and business rules
   * @param {number} id - User ID
   * @param {Object} updateData - Updated user attributes
   * @returns {Object} Updated user record
   */
  async updateUser(id, updateData) {
    // Semantic Validation 1: Verify existence of target resource
    const existingUser = userStore.findById(id);
    if (!existingUser) {
      throw new AppError(`Cannot update. User with ID ${id} does not exist.`, 404);
    }

    // Semantic Validation 2: If email is changed, ensure it is not taken by another user
    if (updateData.email && updateData.email.trim().toLowerCase() !== existingUser.email.toLowerCase()) {
      const emailConflict = userStore.findByEmail(updateData.email);
      if (emailConflict && emailConflict.id !== existingUser.id) {
        throw new AppError(`Email '${updateData.email}' is already in use by another account.`, 400);
      }
    }

    // Semantic Validation 3: Business rule on role downgrade
    if (existingUser.id === 1 && updateData.role && updateData.role !== 'admin') {
      throw new AppError('Business rule violation: Primary system administrator account cannot be demoted.', 400);
    }

    const updated = userStore.update(id, updateData);
    return updated;
  }

  /**
   * Delete user by ID with business rule checks
   * @param {number} id - User ID
   * @returns {boolean} true
   */
  async deleteUser(id) {
    // Semantic Validation: Verify existence of target resource
    const existingUser = userStore.findById(id);
    if (!existingUser) {
      throw new AppError(`Cannot delete. User with ID ${id} does not exist.`, 404);
    }

    // Business Rule: Primary administrator cannot be deleted
    if (existingUser.id === 1) {
      throw new AppError('Business rule violation: Primary root administrator cannot be deleted.', 400);
    }

    userStore.delete(id);
    return true;
  }
}

module.exports = new UserService();
