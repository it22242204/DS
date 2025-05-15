const axios = require("axios");

// Replace this with your actual User Service base URL
const USER_SERVICE_BASE_URL = "http://localhost:5600/api/auth/getAllUsers";

// Get all users (excluding passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_BASE_URL}`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error("Error fetching users via Axios:", err.message);
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
};

// Update user status (pending, active, suspended)
exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "active", "suspended"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Valid options are: ${validStatuses.join(", ")}`
    });
  }

  try {
    const response = await axios.put(`${USER_SERVICE_BASE_URL}/${id}/status`, { status });
    res.status(200).json(response.data);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: "User not found" });
    }
    console.error("Error updating user status via Axios:", err.message);
    res.status(500).json({ message: "An error occurred while updating user status" });
  }
};
