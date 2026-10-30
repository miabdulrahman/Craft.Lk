import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts
} from '../controllers/productController.js';
import { protect, authorize, requireApprovedSeller } from '../middleware/auth.js';
import {
  productCreateSchema,
  productUpdateSchema
} from '../validators/productValidator.js';
import { validateRequest } from '../validators/authValidator.js';

const router = express.Router();

// Public product discovery
router.get('/', getProducts);
router.get('/detail/:id', getProductById);

// Protected: Seller product listing
router.get('/seller/my-products', protect, authorize('seller'), getSellerProducts);

// Protected: Approved sellers can create products
router.post(
  '/',
  protect,
  requireApprovedSeller,
  validateRequest(productCreateSchema),
  createProduct
);

// Protected: Seller owner or Admin can update / delete
router.patch(
  '/:id',
  protect,
  authorize('seller', 'admin'),
  validateRequest(productUpdateSchema),
  updateProduct
);

router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

export default router;
