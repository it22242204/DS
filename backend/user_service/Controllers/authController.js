const User = require("../Models/User"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const axios = require("axios");

// Replace this with your actual User Service base URL
const USER_SERVICE_BASE_URL = "http://localhost:5600/api/auth/getAllUsers";

// Handle user login
const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== role) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Your account is awaiting admin approval or has been suspended.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Handle user registration
const register = async (req, res) => {
  const { name, email, password, role, location } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      status: role === "restaurant" ? "pending" : "active",
      location: {
        location: location?.location, // e.g., "Malabe"
        city: location?.city,         // e.g., "Colombo"
      },
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully. Please wait for admin approval if applicable.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Handle user logout
const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch user by ID (new addition)
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllDrivers = async (req, res) => {
  try {
    // Fetch all active drivers (users with role 'delivery' and status 'active')
    const drivers = await User.find({
      role: 'delivery',
      status: 'active',
    });

    // Check if drivers are found
    if (!drivers || drivers.length === 0) {
      return res.status(404).json({ error: 'No active drivers found' });
    }

    // Get the list of driver IDs to exclude (for example, rejected driver ID passed in the request)
    const { excludeDriverId } = req.query;  // Driver ID to exclude, passed as a query parameter

    // If an ID is passed to exclude, filter it out from the list
    let filteredDrivers = drivers;
    if (excludeDriverId) {
      filteredDrivers = drivers.filter(driver => driver._id.toString() !== excludeDriverId);
    }

    // Return the filtered list of drivers
    return res.status(200).json(filteredDrivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateDriverStatus = async (req, res) => {
  const { id } = req.params;  // Driver ID from URL parameters
  const { status } = req.body;  // New status from request body

  try {
    // Find the driver by ID
    const driver = await User.findById(id);
    
    // If driver not found, return 404 error
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Update driver's status
    driver.status = status;

    // Save the updated driver document
    await driver.save();

    // Respond with success message and updated driver
    res.status(200).json({
      message: 'Driver status updated successfully',
      driver
    });
  } catch (error) {
    // Handle any errors
    console.error('Error updating driver status:', error);
    res.status(500).json({ error: error.message });
  }
};

 const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (excluding passwords)
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select("-password"); // Exclude passwords for security

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    // Optional: Exclude a specific user ID
    const { excludeUserId } = req.query;

    let filteredUsers = users;
    if (excludeUserId) {
      filteredUsers = users.filter(user => user._id.toString() !== excludeUserId);
    }

    // Return the filtered user list
    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Update user status (pending, active, suspended)
const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Check if the status is valid
  const validStatuses = ["pending", "active", "suspended", "busy"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Valid options are: ${validStatuses.join(", ")}`
    });
  }

  try {
    // Find the user and update the status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true } // Return updated user and apply validation
    ).select("-password"); // Exclude the password field from the response

    // Check if the user was found
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user status:", err.message);
    res.status(500).json({ message: "An error occurred while updating user status" });
  }
};



module.exports = {
  login,
  register,
  logout,
  getUserProfile,
  getUserById, 
  getAllDrivers,
  updateDriverStatus,
  updateProfile,
  getAllUsers,
  updateUserStatus
};
