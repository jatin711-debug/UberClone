// scripts/seedData.js

const mongoose = require('mongoose');
const Driver = require('../src/models/Driver.js');
const Rider = require('../src/models/Rider.js');
const Ride = require('../src/models/Ride.js');
const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        const driver1 = new Driver({ name: 'Driver 1', location: { type: 'Point', coordinates: [50, 50] }, isAvailable: true });
        const driver2 = new Driver({ name: 'Driver 2', location: { type: 'Point', coordinates: [51, 51] }, isAvailable: true });

        await driver1.save();
        await driver2.save();

        // Seed Riders
        const rider1 = new Rider({ name: 'Rider 1', location: { type: 'Point', coordinates: [50.5, 50.5] } });
        const rider2 = new Rider({ name: 'Rider 2', location: { type: 'Point', coordinates: [51.5, 51.5] } });

        await rider1.save();
        await rider2.save();

        // Seed Rides
        const ride1 = new Ride({ riderId: rider1._id, driverId: driver1._id, status: 'matched' });
        const ride2 = new Ride({ riderId: rider2._id, driverId: driver2._id, status: 'completed' });

        await ride1.save();
        await ride2.save();

        console.log('Data seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
