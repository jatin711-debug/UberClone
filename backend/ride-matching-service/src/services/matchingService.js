// src/services/matchingService.js

const Driver = require('../models/Driver.js');

const findNearestDriver = async (location) => {
    try {
        const driver = await Driver.findOne({
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: location.coordinates },
                    $maxDistance: 5000, // 5km radius
                },
            },
            isAvailable: true,
        });

        return driver;
    } catch (error) {
        throw new Error('Error finding nearest driver');
    }
};

module.exports = { findNearestDriver };
