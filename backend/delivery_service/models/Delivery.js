const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String, required: true }, // Fetched from User model
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurantName: { type: String, required: true }, // Fetched from User model
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  pickupLocation: {
    location: { type: String, required: true },
    city: { type: String, required: true }
  },
  dropLocation: {
    location: { type: String, required: true },
    city: { type: String, required: true }
  },

  status: {
    type: String,
    enum: ["Pending", "Assigned", "Picked Up", "In Transit", "Delivered", "Cancelled"],
    default: "Pending"
  },
  assignedAt: { type: Date },
  deliveredAt: { type: Date },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Delivery", DeliverySchema);
