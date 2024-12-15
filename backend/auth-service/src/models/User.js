// backend/auth-service/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['passenger', 'driver', 'admin'],
        default: 'passenger'
    },
    profilePicture: {
        type: String,
        default: null
    },
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Static method to check if email exists
UserSchema.statics.emailExists = async function (email) {
    const user = await this.findOne({ email });
    return !!user;
};

module.exports = mongoose.model('User', UserSchema);