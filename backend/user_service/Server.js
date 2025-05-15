const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./database/config.js");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// Routes
const FoodMenuRoute = require("./Routes/FoodMenuRoutes.js");
const categoryRoutes = require("./Routes/CategoryRoutes.js");
const bannerRoutes = require("./Routes/BannerRoutes.js");
const CartRoutes = require("./Routes/CartManagementRoutes.js");
const authRoutes = require("./Routes/authRoute.js");

app.use("/api", FoodMenuRoute);
app.use("/api", categoryRoutes);
app.use("/api", bannerRoutes);
app.use("/api/carts", CartRoutes);
app.use("/api/auth", authRoutes);

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB(); // Wait until DB is connected
    const PORT = process.env.PORT || 5600;
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
