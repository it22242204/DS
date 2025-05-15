const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");


router.post("/assignDriver", deliveryController.assignDriver);
router.post("/reassignDriver", deliveryController.reassignDriver);
router.put("/updateStatus", deliveryController.updateDeliveryStatus);
router.get("/userDeliveries", deliveryController.getDriverDeliveries);
router.get("/getAllNotifications", deliveryController.getUserNotifications);
router.post("/createNotification", deliveryController.createNotification);

module.exports = router;
