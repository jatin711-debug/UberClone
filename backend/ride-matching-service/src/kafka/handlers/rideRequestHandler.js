// src/kafka/handlers/rideRequestHandler.js

const { sendMessage } = require('../producer.js');
const logger = require('../../utils/logger.js');
const matchingService = require('../../services/matchingService.js');
const { TOPICS } = require('../topics.js');

const rideRequestHandler = async (message) => {
    try {
        const { riderId, location } = message;

        const driver = await matchingService.findNearestDriver(location);

        if (driver) {
            const matchInfo = {
                riderId,
                driverId: driver.id,
                pickupLocation: location,
            };

            // Notify rider and driver
            sendMessage(TOPICS.RIDE_MATCHED, matchInfo);
            logger.info(`Rider ${riderId} matched with driver ${driver.id}`);
        } else {
            logger.warn('No available drivers');
        }
    } catch (error) {
        logger.error(`Error handling ride request: ${error.message}`);
    }
};

module.exports = rideRequestHandler;
