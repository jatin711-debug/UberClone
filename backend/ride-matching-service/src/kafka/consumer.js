// src/kafka/consumer.js

const { Kafka } = require('kafkajs');
const logger = require('../utils/logger.js');
const rideRequestHandler = require('./handlers/rideRequestHandler.js');

const kafka = new Kafka({
    clientId: 'ride-matching-service',
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'ride-matching-group' });

const kafkaConsumer = async () => {
    await consumer.connect();
    logger.info('Kafka Consumer connected');

    await consumer.subscribe({ topic: process.env.KAFKA_RIDE_REQUEST_TOPIC, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            logger.info(`Received message on topic ${topic}: ${message.value.toString()}`);
            rideRequestHandler(JSON.parse(message.value.toString()));
        },
    });
};

module.exports = kafkaConsumer;
