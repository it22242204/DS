const express = require("express");
const router = express.Router();
const cartController = require("../Controllers/CartManagementController");

// Apply customer verification middleware to all cart routes
router.use(cartController.verifyCustomer);

router.get("/", cartController.getCart);
router.post("/add", cartController.updateCart);

router.put("/update/:itemId", cartController.updateItemQuantity);
router.delete("/remove/:itemId", cartController.removeItem);
router.delete("/clear", cartController.clearCart);

module.exports = router;
