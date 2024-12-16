// src/controllers/matchController.js

const matchingService = require('../services/matchingService.js');
const { sendMessage } = require('../kafka/producer.js');

module.exports.findMatch = async (req, res) => {
    const { riderId, location } = req.body;

    try {
        const driver = await matchingService.findNearestDriver(location);

        if (!driver) {
            return res.status(404).json({ message: 'No available drivers found' });
        }

        const matchInfo = {
            riderId,
            driverId: driver._id,
            pickupLocation: location,
        };

        // Notify via Kafka
        sendMessage(process.env.KAFKA_RIDE_MATCHED_TOPIC, matchInfo);

        res.status(200).json({ message: 'Driver matched successfully', matchInfo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
