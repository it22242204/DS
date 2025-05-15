const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const sendSMS = require("./send_sms");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5300;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post("/api/notifications/sms", async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: "Recipient and message are required" });
    }

    // Send SMS using Twilio
    await sendSMS(to, message);

    res.status(200).json({ success: true, message: "SMS sent successfully" });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

// Health check route
app.get("/", (req, res) => {
  res.send("Notification Service is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});