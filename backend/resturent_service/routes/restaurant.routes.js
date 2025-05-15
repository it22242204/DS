const express = require('express');
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  updateAvailability,
  updateOpeningHours
} = require('../controllers/restaurant.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

// Include other resource routers
const menuRouter = require('./menu.routes');
const orderRouter = require('./order.routes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:restaurantId/menu', menuRouter);
router.use('/:restaurantId/orders', orderRouter);

router
  .route('/')
  .get(getRestaurants)
  .post(protect, authorize('restaurantOwner', 'admin'), createRestaurant);

router
  .route('/:id')
  .get(getRestaurant)
  .put(protect, authorize('restaurantOwner', 'admin'), updateRestaurant)
  .delete(protect, authorize('restaurantOwner', 'admin'), deleteRestaurant);

router
  .route('/:id/availability')
  .put(protect, authorize('restaurantOwner', 'admin'), updateAvailability);

router
  .route('/:id/opening-hours')
  .put(protect, authorize('restaurantOwner', 'admin'), updateOpeningHours);

module.exports = router;
