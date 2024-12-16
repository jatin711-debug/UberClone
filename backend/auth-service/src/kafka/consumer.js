const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "auth-service",
    brokers: [process.env.KAFKA_BROKER_URL || "localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "auth-service-group" });

const connectConsumer = async (topic, handleMessage) => {
    try {
        await consumer.connect();
        console.log("Kafka Consumer connected successfully");

        await consumer.subscribe({ topic, fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = JSON.parse(message.value.toString());
                console.log(`Message received from topic ${topic}:`, value);
                await handleMessage(value);
            },
        });
    } catch (err) {
        console.error("Error connecting Kafka Consumer:", err);
    }
};

module.exports = { connectConsumer };
