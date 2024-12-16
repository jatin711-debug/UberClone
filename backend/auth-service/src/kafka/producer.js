const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "auth-service",
    brokers: [process.env.KAFKA_BROKER_URL || "localhost:9092"],
});

const producer = kafka.producer();

const connectProducer = async () => {
    try {
        await producer.connect();
        console.log("Kafka Producer connected successfully");
    } catch (err) {
        console.error("Error connecting Kafka Producer:", err);
    }
};

const sendMessage = async (topic, message) => {
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        console.log(`Message sent to topic ${topic}:`, message);
    } catch (err) {
        console.error("Error sending Kafka message:", err);
    }
};

module.exports = { connectProducer, sendMessage };
