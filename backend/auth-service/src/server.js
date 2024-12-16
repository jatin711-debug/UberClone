const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const { connectConsumer } = require("./kafka/consumer");
const handleUserEvents = require("./kafka/handlers/userEventsHandler");
// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(express.json());

// Connect to Database
connectDB();

(async () => {
    await connectConsumer("USER_REGISTERED", handleUserEvents);
})();

// Import Routes
const authRoutes = require("./routes/authRoutes");

// Register Routes
app.use("/api/auth", authRoutes);

// Global Error Handler
app.use(require("./middlewares/errorMiddleware"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
