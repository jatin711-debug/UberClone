// scripts/kafkaTopics.js

const { Kafka } = require('kafkajs');
const { TOPICS } = require('../src/kafka/topics.js');

const kafka = new Kafka({
    clientId: 'ride-matching-service',
    brokers: [process.env.KAFKA_BROKER],
});

const admin = kafka.admin();

const createKafkaTopics = async () => {
    try {
        await admin.connect();

        const topicsToCreate = Object.values(TOPICS).map((topic) => ({
            topic,
            numPartitions: 1,
            replicationFactor: 1,
        }));

        await admin.createTopics({
            waitForLeaders: true,
            topics: topicsToCreate,
        });

        console.log('Kafka topics created successfully!');
        await admin.disconnect();
    } catch (err) {
        console.error('Error creating Kafka topics:', err);
        process.exit(1);
    }
};

createKafkaTopics();
