// backend/auth-service/src/models/Session.js
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    device: {
        type: String,
        enum: ['mobile', 'web', 'admin'],
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient token lookup and cleanup
SessionSchema.index({ token: 1 }, { unique: true });
SessionSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Session', SessionSchema);