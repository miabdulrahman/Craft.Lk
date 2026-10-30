import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateSellerOrderStatus
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  orderCreateSchema,
  orderStatusUpdateSchema
} from '../validators/orderValidator.js';
import { validateRequest } from '../validators/authValidator.js';

const router = express.Router();

// Customer order operations
router.post('/', protect, validateRequest(orderCreateSchema), createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/cancel', protect, cancelOrder);

// Seller order operations
router.get('/seller/orders', protect, authorize('seller', 'admin'), getSellerOrders);
router.patch(
  '/seller/orders/:id/status',
  protect,
  authorize('seller', 'admin'),
  validateRequest(orderStatusUpdateSchema),
  updateSellerOrderStatus
);

export default router;
