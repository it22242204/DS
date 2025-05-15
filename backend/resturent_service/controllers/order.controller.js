const Order = require('../models/order.model');
const Restaurant = require('../models/restaurant.model');
const MenuItem = require('../models/menuItem.model');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const axios = require('axios');

// @desc    Get all orders for a restaurant
// @route   GET /api/restaurants/:restaurantId/orders
// @access  Private (Owner/Admin)
exports.getRestaurantOrders = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;
  const { status } = req.query;
  
  const restaurant = await Restaurant.findById(restaurantId);
  
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant not found with id of ${restaurantId}`, 404));
  }
  
  // Check if user is restaurant owner
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view orders for this restaurant`, 401));
  }
  
  let query = { restaurant: restaurantId };
  
  // Add status filter if provided
  if (status) {
    query.status = status;
  }
  
  const orders = await Order.find(query)
    .populate('customer', 'name email phone')
    .populate('items.menuItem', 'name price')
    .sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email phone')
    .populate('restaurant', 'name address contactInfo')
    .populate('items.menuItem', 'name price image');
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user is restaurant owner, admin, or the customer who placed the order
  const restaurant = await Restaurant.findById(order.restaurant);
  
  if (
    restaurant.owner.toString() !== req.user.id && 
    req.user.role !== 'admin' &&
    order.customer.toString() !== req.user.id
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view this order`, 401));
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Owner/Admin)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  if (!status) {
    return next(new ErrorResponse('Please provide order status', 400));
  }
  
  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];
  
  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse(`Invalid status value. Must be one of: ${validStatuses.join(', ')}`, 400));
  }
  
  let order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }
  
  const restaurant = await Restaurant.findById(order.restaurant);
  
  // Check if user is restaurant owner or admin
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this order`, 401));
  }
  
  // If order is being cancelled, check if it's not already delivered
  if (status === 'Cancelled' && order.status === 'Delivered') {
    return next(new ErrorResponse(`Cannot cancel an already delivered order`, 400));
  }
  
  // Update estimated delivery time if status is confirmed
  let update = { status };
  
  if (status === 'Confirmed') {
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 45); // Example: 45 minutes for delivery
    update.estimatedDeliveryTime = estimatedDeliveryTime;
  }
  
  // Set actual delivery time if status is delivered
  if (status === 'Delivered') {
    update.actualDeliveryTime = new Date();
  }
  
  order = await Order.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true, runValidators: true }
  ).populate('customer', 'name email phone');
  
  // Send notification to customer about status update
  try {
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/notifications`,
      {
        userId: order.customer._id,
        title: 'Order Status Update',
        message: `Your order #${order._id.toString().slice(-6)} has been updated to: ${status}`,
        type: 'orderUpdate',
        data: {
          orderId: order._id,
          status
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (err) {
    console.error('Failed to send notification:', err);
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});
