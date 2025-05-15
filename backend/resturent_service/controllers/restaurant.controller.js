const Restaurant = require('../models/restaurant.model');
const MenuItem = require('../models/menuItem.model');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = asyncHandler(async (req, res, next) => {
  const restaurants = await Restaurant.find();
  res.status(200).json({
    success: true,
    count: restaurants.length,
    data: restaurants
  });
});

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: restaurant
  });
});

// @desc    Create restaurant
// @route   POST /api/restaurants
// @access  Private (Owner/Admin)
exports.createRestaurant = asyncHandler(async (req, res, next) => {
  // Add owner to req.body
  req.body.owner = req.user.id;
  
  const restaurant = await Restaurant.create(req.body);
  
  res.status(201).json({
    success: true,
    data: restaurant
  });
});

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Owner/Admin)
exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  let restaurant = await Restaurant.findById(req.params.id);
  
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user is restaurant owner
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restaurant`, 401));
  }
  
  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: restaurant
  });
});

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (Owner/Admin)
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user is restaurant owner
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this restaurant`, 401));
  }
  
  await Restaurant.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update restaurant availability
// @route   PUT /api/restaurants/:id/availability
// @access  Private (Owner/Admin)
exports.updateAvailability = asyncHandler(async (req, res, next) => {
  const { isAvailable } = req.body;
  
  if (isAvailable === undefined) {
    return next(new ErrorResponse('Please provide availability status', 400));
  }
  
  let restaurant = await Restaurant.findById(req.params.id);
  
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user is restaurant owner
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restaurant`, 401));
  }
  
  restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { isAvailable },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    data: restaurant
  });
});

// @desc    Update restaurant opening hours
// @route   PUT /api/restaurants/:id/opening-hours
// @access  Private (Owner/Admin)
exports.updateOpeningHours = asyncHandler(async (req, res, next) => {
  const { openingHours } = req.body;
  
  if (!openingHours || !Array.isArray(openingHours)) {
    return next(new ErrorResponse('Please provide valid opening hours', 400));
  }
  
  let restaurant = await Restaurant.findById(req.params.id);
  
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user is restaurant owner
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restaurant`, 401));
  }
  
  restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { openingHours },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    data: restaurant
  });
});
