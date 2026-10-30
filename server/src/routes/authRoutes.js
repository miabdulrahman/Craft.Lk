import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateMe
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  validateRequest
} from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.patch('/me', protect, validateRequest(updateProfileSchema), updateMe);

export default router;
