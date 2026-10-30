import multer from 'multer';
import path from 'path';

// Use memory storage for direct streaming to Cloudinary (no local disk files)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|svg|avif|heic/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext || mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp, svg, avif) are allowed!'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter
});
