import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getSellerApplications,
  approveSeller,
  rejectSeller,
  getAllOrders,
  moderateProduct
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUserStatus);
router.get('/sellers', getSellerApplications);
router.patch('/sellers/:id/approve', approveSeller);
router.patch('/sellers/:id/reject', rejectSeller);
router.get('/orders', getAllOrders);
router.patch('/products/:id/moderate', moderateProduct);

export default router;
