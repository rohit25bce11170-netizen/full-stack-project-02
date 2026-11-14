/**
 * User Controller - HTTP Request/Response Handler
 * Translates HTTP requests to service calls and returns standardized JSON responses.
 */

const userService = require('../services/userService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/users
 * Retrieve all users with optional filtering
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.query);
    return sendSuccess(res, 200, 'Users retrieved successfully', {
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Retrieve a single user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users
 * Create a new user resource
 */
const createUser = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body);
    return sendSuccess(res, 201, 'User created successfully', newUser);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Update an existing user resource
 */
const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    return sendSuccess(res, 200, 'User updated successfully', updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Remove a user resource.
 * Supports demonstrating both 200 OK and 204 No Content:
 * - If query parameter ?noContent=true is provided, returns HTTP 204 No Content.
 * - Otherwise returns HTTP 200 OK with confirmation payload.
 */
const deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await userService.deleteUser(id);

    if (req.query.noContent === 'true' || req.headers['prefer'] === 'return=minimal') {
      return sendSuccess(res, 204, 'User deleted');
    }

    return sendSuccess(res, 200, 'User deleted successfully', { deletedUserId: id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
