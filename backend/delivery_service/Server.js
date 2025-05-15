const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { PORT, BASE_URL } = require("./config/env");

// Routes
const deliveryRoutes = require("./routes/deliveryRoute");
const earningsRoute = require ("./routes/earningsRoute.js");

// Create express app
const app = express();

// ✅ Enable CORS for frontend at port 8080
app.use(cors({ origin: "http://localhost:8080", credentials: true }));

// Middleware to parse incoming JSON data
app.use(express.json());

// Use the delivery routes
app.use("/api/delivery", deliveryRoutes);
app.use("/api/earnings", earningsRoute);

// Catch undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Database Connection and Server Start
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${BASE_URL}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to database connection error:", err);
  });

module.exports = app;
