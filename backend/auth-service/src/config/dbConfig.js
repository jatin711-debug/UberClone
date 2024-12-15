// backend/auth-service/src/config/dbConfig.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'ride-sharing-auth'
        });

        console.log(`MongoDB Connected: ${connection.connection.host}`);
        return connection;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;