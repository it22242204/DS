const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");


router.post("/login",authController.login);
router.post("/register",authController.register);
router.put("/logout", authController.logout);
router.get("/getAllUsers", authController.getAllUsers);
router.get("/getUserProfile", authController.getUserProfile);
router.get("/getAllDrivers", authController.getAllDrivers);
router.put("/updateProfile/:id", authController.updateProfile);
router.patch("/updateUserStatus/:id", authController.updateUserStatus);

router.get("/:userId", authController.getUserById);


module.exports = router;