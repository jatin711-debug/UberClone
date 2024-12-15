// backend/auth-service/src/routes/sessionRoutes.js
const express = require('express');
const SessionController = require('../controllers/sessionController');

const router = express.Router();

// Logout route (invalidate session)
router.post('/logout', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        await SessionController.invalidateSession(token);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Logout failed',
            error: error.message
        });
    }
});

// Validate session route
router.post('/validate', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const userId = await SessionController.validateSession(token);

        if (userId) {
            res.status(200).json({
                valid: true,
                userId
            });
        } else {
            res.status(401).json({
                valid: false,
                message: 'Invalid or expired session'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Session validation failed',
            error: error.message
        });
    }
});

module.exports = router;