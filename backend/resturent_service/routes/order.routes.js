const express = require('express');
const {
  getRestaurantOrders,
  getOrder,
  updateOrderStatus
} = require('../controllers/order.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, authorize('restaurantOwner', 'admin'), getRestaurantOrders);

router
  .route('/:id')
  .get(protect, getOrder);

router
  .route('/:id/status')
  .put(protect, authorize('restaurantOwner', 'admin'), updateOrderStatus);

module.exports = router;
