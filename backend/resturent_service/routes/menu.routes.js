const express = require('express');
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateMenuItemAvailability,
  getMenuCategories,
  createMenuCategory
} = require('../controllers/menu.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Routes for menu items
router
  .route('/')
  .get(getMenuItems)
  .post(protect, authorize('restaurantOwner', 'admin'), createMenuItem);

router
  .route('/:id')
  .get(getMenuItem)
  .put(protect, authorize('restaurantOwner', 'admin'), updateMenuItem)
  .delete(protect, authorize('restaurantOwner', 'admin'), deleteMenuItem);

router
  .route('/:id/availability')
  .put(protect, authorize('restaurantOwner', 'admin'), updateMenuItemAvailability);

// Routes for menu categories
router
  .route('/categories')
  .get(getMenuCategories)
  .post(protect, authorize('restaurantOwner', 'admin'), createMenuCategory);

module.exports = router;
