// src/models/Rider.js

const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
}, { timestamps: true });

const Rider = mongoose.model('Rider', riderSchema);

module.exports = Rider;
