const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "restaurant", "delivery"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "active", "suspended","busy"],
    default: "pending"
  },
  location: {
    location: { type: String, required: true },
    city: { type: String, required: true }      
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);