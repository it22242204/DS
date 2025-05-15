const Delivery = require("../models/Delivery");
const Notification = require("../models/Notification");
const axios = require("axios");

// Assign Driver
exports.assignDriver = async (req, res) => {
  try {
    const { orderId, customerId, restaurantId } = req.body;

    // Use Docker service name instead of localhost
    const customerResponse = await axios.get(
      `http://user-service:5600/api/auth/${customerId}`
    );
    const restaurantResponse = await axios.get(
      `http://user-service:5600/api/auth/${restaurantId}`
    );

    const customer = customerResponse.data;
    const restaurant = restaurantResponse.data;

    if (!customer || !restaurant) {
      return res
        .status(404)
        .json({ error: "Customer or restaurant not found" });
    }

    const pickupLocation = {
      location: restaurant.location?.location,
      city: restaurant.location?.city,
    };

    const dropLocation = {
      location: customer.location?.location,
      city: customer.location?.city,
    };

    const driverResponse = await axios.get(
      'http://user-service:5600/api/auth/getAllDrivers'
    );
    const allDrivers = driverResponse.data;

    let driver = allDrivers.find((d) =>
      new RegExp(`^${pickupLocation.location}$`, "i").test(d.location.location)
    );

    if (!driver) {
      driver = allDrivers.find((d) =>
        new RegExp(`^${pickupLocation.city}$`, "i").test(d.location.city)
      );
    }

    if (!driver) {
      driver = allDrivers.find((d) => d.status === "active");
    }

    if (!driver) {
      return res.status(404).json({ error: "No available driver found" });
    }

    const newDelivery = new Delivery({
      orderId,
      customerId,
      customerName: customer.name,
      restaurantId,
      restaurantName: restaurant.name,
      driverId: driver._id,
      pickupLocation,
      dropLocation,
      status: "Pending",
      assignedAt: new Date(),
    });

    await newDelivery.save();

    await Notification.create({
      userId: driver._id,
      message: "You have been assigned a new delivery!",
    });

    res.status(201).json({
      message: "Driver assigned successfully",
      delivery: newDelivery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Reassign Driver
exports.reassignDriver = async (req, res) => {
  try {
    const { deliveryId } = req.body;
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    if (delivery.status !== "pending" && delivery.status !== "Cancelled") {
      return res
        .status(400)
        .json({ error: "Driver has not rejected the assignment yet" });
    }

    const { excludeDriverId } = req.query;
    let driverResponse = await axios.get(
      'http://user-service:5600/api/auth/getAllDrivers'
    );
    let availableDrivers = driverResponse.data;

    if (excludeDriverId) {
      availableDrivers = availableDrivers.filter(
        (driver) => driver._id.toString() !== excludeDriverId
      );
    }

    let driver = availableDrivers.find(
      (d) => d.location === delivery.pickupLocation.location
    );

    if (!driver) {
      driver = availableDrivers.find(
        (d) => d.city === delivery.pickupLocation.city
      );
    }

    if (!driver) {
      driver = availableDrivers[0];
    }

    if (!driver) {
      return res.status(404).json({ error: "No available driver found" });
    }

    delivery.driverId = driver._id;
    delivery.status = "Cancelled";
    delivery.assignedAt = new Date();
    await delivery.save();

    await Notification.create({
      userId: driver._id,
      message: "Reassigned a new delivery!",
    });

    res.status(200).json({
      message: "Driver reassigned successfully",
      delivery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update Delivery Status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId, status } = req.body;
    const validStatuses = [
      "Pending",
      "Assigned",
      "Picked Up",
      "In Transit",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    delivery.status = status;
    if (status === "Picked Up") {
      delivery.assignedAt = Date.now();
    } else if (status === "In Transit") {
      delivery.updatedAt = Date.now();
    } else if (status === "Delivered") {
      delivery.deliveredAt = Date.now();
    }

    await delivery.save();

    res.json({ message: "Delivery status updated", delivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Deliveries
exports.getDriverDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    if (!deliveries.length) {
      return res.status(404).json({ error: "No deliveries found" });
    }

    res.json({ message: "Deliveries fetched successfully", deliveries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    if (!notifications.length) {
      return res.status(404).json({ error: "No notifications found" });
    }

    res.status(200).json({
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Create Notification
exports.createNotification = async (req, res) => {
  const { userId, message } = req.body;

  try {
    if (!userId || !message) {
      return res
        .status(400)
        .json({ error: "userId and message are required" });
    }

    const newNotification = await Notification.create({ userId, message });

    res.status(201).json({
      success: true,
      notification: newNotification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res
      .status(500)
      .json({ error: "Server error while creating notification" });
  }
};
