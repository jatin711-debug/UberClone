// backend/auth-service/src/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

class UserController {
    async register(req, res) {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, email, password, firstName, lastName, role } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(409).json({
                    message: 'User with this email or username already exists'
                });
            }

            // Create new user
            const user = new User({
                username,
                email,
                password,
                firstName,
                lastName,
                role
            });

            await user.save();

            // Generate verification token (optional)
            const verificationToken = this.generateVerificationToken(user);

            // Send verification email (not implemented here)
            // this.sendVerificationEmail(user.email, verificationToken);

            res.status(201).json({
                message: 'User registered successfully',
                userId: String(user._id)    
            });
        } catch (error) {
            res.status(500).json({
                message: 'Registration failed',
                error: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Compare passwords
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = this.generateAuthToken(user);

            res.status(200).json({
                token,
                userId: String(user._id),
                role: user.role
            });
        } catch (error) {
            res.status(500).json({
                message: 'Login failed',
                error: error.message
            });
        }
    }

    generateAuthToken(user) {
        return jwt.sign(
            {
                username: user.username,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || "secret",
            { expiresIn: '24h' }
        );
    }

    generateVerificationToken(user) {
        return jwt.sign(
            { username: user.username, email: user.email },
            process.env.VERIFICATION_SECRET || "secret",
            { expiresIn: '7d' }
        );
    }
}

module.exports = new UserController();