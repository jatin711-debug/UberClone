const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const logger = require('./utils/logger.js');
const connectDB = require('./config/db.js');
const kafkaConsumer = require('./kafka/consumer.js');
const kafkaProducer = require('./kafka/producer.js');
const matchRoutes = require('./routes/matchRoutes.js');
const rideRoutes = require('./routes/rideRoutes.js');

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/match', matchRoutes);
app.use('/api/ride', rideRoutes);

// Connect to database
connectDB().then(() => logger.info('Database connected successfully'));

// Initialize Kafka
kafkaConsumer();
kafkaProducer.kafkaProducer();

// Start server
app.listen(PORT, () => {
    logger.info(`Ride-Matching Service running on port ${PORT}`);
});
