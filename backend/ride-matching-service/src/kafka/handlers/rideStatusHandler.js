// src/kafka/handlers/rideStatusHandler.js

const { sendMessage } = require('../producer.js');
const logger = require('../../utils/logger.js');
const { TOPICS } = require('../topics.js');

const rideStatusHandler = async (message) => {
    const { rideId, status } = message;

    try {
        switch (status) {
            case 'started':
                // Handle ride start logic, e.g., update database
                logger.info(`Ride ${rideId} started`);
                break;
            case 'completed':
                // Handle ride completion
                logger.info(`Ride ${rideId} completed`);
                break;
            case 'canceled':
                // Handle ride cancellation
                logger.info(`Ride ${rideId} canceled`);
                break;
            default:
                logger.warn(`Unknown status: ${status} for ride ${rideId}`);
        }

        // Example: Send a message to Kafka if needed (e.g., notify other services)
        sendMessage(TOPICS.RIDE_STATUS_UPDATE, { rideId, status });
    } catch (error) {
        logger.error(`Error in rideStatusHandler: ${error.message}`);
    }
};

module.exports = rideStatusHandler;
