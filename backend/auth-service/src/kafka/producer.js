const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "auth-service",
    brokers: [process.env.KAFKA_BROKER_URL],
});

const producer = kafka.producer();

const connectProducer = async () => {
    await producer.connect();
    console.log("Kafka Producer Connected");
};

const sendMessage = async (topic, message) => {
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        console.log(`Message sent to topic ${topic}:`, message);
    } catch (err) {
        console.error("Error sending message to Kafka:", err);
    }
};

module.exports = { connectProducer, sendMessage };
