import express from 'express';
import { upload } from '../middleware/upload.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('seller', 'admin'),
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file uploaded or invalid file format.'
        });
      }

      const folder = req.query.folder === 'shops' ? 'craftlk/shops' : 'craftlk/products';
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, folder);

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully as WebP!',
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        provider: result.provider
      });
    } catch (error) {
      console.error('[Upload Error]:', error);
      res.status(500).json({
        success: false,
        message: `Upload failed: ${error.message || 'Unknown error'}`
      });
    }
  }
);

export default router;
