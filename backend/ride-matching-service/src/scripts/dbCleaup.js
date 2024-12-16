// scripts/dbCleanup.js

const mongoose =  require('mongoose');
const Ride = require('../models/Ride.js');

const cleanupOldRides = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Clean up rides that are completed or canceled older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await Ride.deleteMany({ status: { $in: ['completed', 'canceled'] }, updatedAt: { $lt: thirtyDaysAgo } });
        console.log(`${result.deletedCount} rides cleaned up successfully!`);
        process.exit();
    } catch (err) {
        console.error('Error cleaning up old rides:', err);
        process.exit(1);
    }
};

cleanupOldRides();
