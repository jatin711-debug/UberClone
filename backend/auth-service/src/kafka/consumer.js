const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "auth-service",
    brokers: [process.env.KAFKA_BROKER_URL],
});

const consumer = kafka.consumer({ groupId: "auth-service-group" });

const connectConsumer = async (topic, handleMessage) => {
    await consumer.connect();
    console.log("Kafka Consumer Connected");
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = JSON.parse(message.value.toString());
            console.log(`Received message from topic ${topic}:`, value);
            handleMessage(value);
        },
    });
};

module.exports = { connectConsumer };
