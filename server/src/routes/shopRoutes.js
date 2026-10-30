import express from 'express';
import {
  applySeller,
  getMyShop,
  updateMyShop,
  getPublicShops,
  getPublicShopById
} from '../controllers/shopController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicShops);
router.get('/public/:id', getPublicShopById);

// Protected seller routes
router.post('/apply', protect, applySeller);
router.get('/me', protect, authorize('seller', 'admin'), getMyShop);
router.patch('/me', protect, authorize('seller'), updateMyShop);

export default router;
