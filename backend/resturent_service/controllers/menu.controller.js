const MenuItem = require('../models/menuItem.model');
const MenuCategory = require('../models/menuCategory.model');
const Restaurant = require('../models/restaurant.model');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all menu items for a restaurant
// @route   GET /api/restaurants/:restaurantId/menu
// @access  Public
exports.getMenuItems = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;
  
  const restaurant = await Restaurant.findById(restaurantId);
  
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant not found with id of ${restaurantId}`, 404));
  }
  
  const menuItems = await MenuItem.find({ restaurant: restaurantId });
  
  res.status(200).json({
    success: true,
    count: menuItems.length,
    data: menuItems
  });
});

// @desc    Get single menu item
// @route   GET /api/menus/:id
// @access  Public
exports.getMenuItem = asyncHandler(async (req, res, next) => {
  const menuItem = await MenuItem.findById(req.params.id);
  
  if (!menuItem) {
    return next(new ErrorResponse(`Menu item not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: menuItem
  });
});

// @desc    Create menu item
// @route   POST /api/restaurants/:restaurantId/menu
// @access  Private (Owner/Admin)
exports.createMenuItem = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;
  
  // Add restaurant to req.body
  req.body.restaurant = restaurantId;
  
  const restaurant = await Restaurant.findById(restaurantId);
  
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant not found with id of ${restaurantId}`, 404));
  }
  
  // Check if user is restaurant owner
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add menu items to this restaurant`, 401));
  }
  
  const menuItem = await MenuItem.create(req.body);
  
  res.status(201).json({
    success: true,
    data: menuItem
  });
});

// @desc    Update menu item
// @route   PUT /api/menus/:id
// @access  Private (Owner/Admin)
exports.updateMenuItem = asyncHandler(async (req, res, next) => {
  let menuItem = await MenuItem.findById(req.params.id);
  
  if (!menuItem) {
    return next(new ErrorResponse(`Menu item not found with id of ${req.params.id}`, 404));
  }
  
  const restaurant = await Restaurant.findById(menuItem.restaurant);
  
  // Check if user is restaurant owner
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update menu items for this restaurant`, 401));
  }
  
  menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: menuItem
  });
});

// @desc    Delete menu item
// @route   DELETE /api/menus/:id
// @access  Private (Owner/Admin)
exports.deleteMenuItem = asyncHandler(async (req, res, next) => {
  const menuItem = await MenuItem.findById(req.params.id);
  
  if (!menuItem) {
    return next(new ErrorResponse(`Menu item not found with id of ${req.params.id}`, 404));
  }
  
  const restaurant = await Restaurant.findById(menuItem.restaurant);
  
  // Check if user is restaurant owner
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete menu items for this restaurant`, 401));
  }
  
  await MenuItem.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update menu item availability
// @route   PUT /api/menus/:id/availability
// @access  Private (Owner/Admin)
exports.updateMenuItemAvailability = asyncHandler(async (req, res, next) => {
  const { isAvailable } = req.body;
  
  if (isAvailable === undefined) {
    return next(new ErrorResponse('Please provide availability status', 400));
  }
  
  let menuItem = await MenuItem.findById(req.params.id);
  
  if (!menuItem) {
    return next(new ErrorResponse(`Menu item not found with id of ${req.params.id}`, 404));
  }
  
  const restaurant = await Restaurant.findById(menuItem.restaurant);
  
  // Check if user is restaurant owner
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update menu items for this restaurant`, 401));
  }
  
  menuItem = await MenuItem.findByIdAndUpdate(
    req.params.id,
    { isAvailable },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    data: menuItem
  });
});

// @desc    Get all menu categories for a restaurant
// @route   GET /api/restaurants/:restaurantId/categories
// @access  Public
exports.getMenuCategories = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;
  
  const restaurant = await Restaurant.findById(restaurantId);
  
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant not found with id of ${restaurantId}`, 404));
  }
  
  const categories = await MenuCategory.find({ restaurant: restaurantId }).sort('displayOrder');
  
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Create menu category
// @route   POST /api/restaurants/:restaurantId/categories
// @access  Private (Owner/Admin)
exports.createMenuCategory = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;
  
  // Add restaurant to req.body
  req.body.restaurant = restaurantId;
  
  const restaurant = await Restaurant.findById(restaurantId);
  
  if (!restaurant) {
    return next(new ErrorResponse(`Restaurant not found with id of ${restaurantId}`, 404));
  }
  
  // Check if user is restaurant owner
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add categories to this restaurant`, 401));
  }
  
  const category = await MenuCategory.create(req.body);
  
  res.status(201).json({
    success: true,
    data: category
  });
});
