// backend/auth-service/src/index.js
const express = require('express');
const connectDB = require('./config/dbConfig');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err.stack
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});

module.exports = app;