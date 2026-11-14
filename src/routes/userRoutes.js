/**
 * User Routes
 * Defines RESTful endpoints for the User resource.
 * Adheres strictly to noun-based naming: /api/users
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const AppError = require('../utils/appError');
const {
  validateUserIdParam,
  validateCreateUser,
  validateUpdateUser
} = require('../middleware/validateUser');

// GET /api/users - Retrieve all users
// POST /api/users - Create new user
router.route('/')
  .get(userController.getAllUsers)
  .post(validateCreateUser, userController.createUser)
  .all((req, res, next) => {
    res.set('Allow', 'GET, POST');
    next(new AppError(`HTTP method ${req.method} is not supported on /api/users. Allowed methods: GET, POST.`, 405));
  });

// GET /api/users/:id - Retrieve user by ID
// PUT /api/users/:id - Update user by ID
// DELETE /api/users/:id - Delete user by ID
router.route('/:id')
  .get(validateUserIdParam, userController.getUserById)
  .put(validateUserIdParam, validateUpdateUser, userController.updateUser)
  .delete(validateUserIdParam, userController.deleteUser)
  .all((req, res, next) => {
    res.set('Allow', 'GET, PUT, DELETE');
    next(new AppError(`HTTP method ${req.method} is not supported on /api/users/:id. Allowed methods: GET, PUT, DELETE.`, 405));
  });

module.exports = router;
