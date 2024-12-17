// src/kafka/producer.js

const { Kafka } = require('kafkajs');
const logger = require('../utils/logger.js');

const kafka = new Kafka({
    clientId: 'ride-matching-service',
    brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

const kafkaProducer = async () => {
    await producer.connect();
    logger.info('Kafka Producer connected');
};

const sendMessage = async (topic, message) => {
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        logger.info(`Message sent to topic ${topic}: ${JSON.stringify(message)}`);
    } catch (error) {
        logger.error(`Error sending message: ${error.message}`);
    }
};

module.exports = { kafkaProducer, sendMessage };
