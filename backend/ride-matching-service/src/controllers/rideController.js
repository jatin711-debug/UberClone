// src/controllers/rideController.js

const Ride = require('../models/Ride.js');

module.exports.createRide = async (req, res) => {
    const { riderId, driverId, pickupLocation, dropoffLocation } = req.body;

    try {
        const ride = await Ride.create({
            rider: riderId,
            driver: driverId,
            pickupLocation,
            dropoffLocation,
        });

        res.status(201).json({ message: 'Ride created successfully', ride });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getRideById = async (req, res) => {
    const { id } = req.params;

    try {
        const ride = await Ride.findById(id).populate('rider driver');
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        res.status(200).json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
