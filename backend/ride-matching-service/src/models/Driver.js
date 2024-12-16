
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

driverSchema.index({ location: '2dsphere' });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
