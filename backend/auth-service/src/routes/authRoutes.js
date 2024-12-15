// backend/auth-service/src/routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/userController');

const router = express.Router();

// Validation middleware for registration
const registrationValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must include uppercase, lowercase, number, and special character'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required')
];

// Registration route
router.post('/register', registrationValidation, UserController.register);

// Login route
router.post('/login', [
    body('email').trim().isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
], UserController.login);

module.exports = router;