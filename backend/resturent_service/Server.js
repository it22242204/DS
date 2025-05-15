// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const restaurantRoutes = require('./routes/restaurant.routes');
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/order.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/error.middleware');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);

// Health check route (optional)
app.get('/', (req, res) => {
    res.send('Restaurant Service API is running');
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Restaurant service running on port ${PORT}`);
});

module.exports = app;
