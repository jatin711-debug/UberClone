// backend/auth-service/src/controllers/sessionController.js
const Session = require('../models/Session');
const jwt = require('jsonwebtoken');

class SessionController {
    async createSession(userId, device, ipAddress) {
        try {
            // Generate JWT token for session
            const token = jwt.sign(
                { userId },
                process.env.SESSION_SECRET,
                { expiresIn: '30d' }
            );

            // Create session record
            const session = new Session({
                userId,
                token,
                device,
                ipAddress,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            });

            await session.save();

            return token;
        } catch (error) {
            console.error('Session creation failed', error);
            throw error;
        }
    }

    async invalidateSession(token) {
        try {
            await Session.findOneAndUpdate(
                { token },
                { isActive: false }
            );
        } catch (error) {
            console.error('Session invalidation failed', error);
            throw error;
        }
    }

    async validateSession(token) {
        try {
            // Verify JWT token
            const decoded = jwt.verify(token, process.env.SESSION_SECRET);

            // Check if session exists and is active
            const session = await Session.findOne({
                token,
                userId: decoded.userId,
                isActive: true
            });

            return session ? decoded.userId : null;
        } catch (error) {
            return null;
        }
    }
}

module.exports = new SessionController();