const express = require("express");
const { getDriverEarnings, createEarnings } = require ("../controllers/earningsController.js");

const router = express.Router();

// Get earnings by driver ID
router.get("/:driverId", getDriverEarnings);

// Create earnings
router.post("/", createEarnings);

module.exports = router;
