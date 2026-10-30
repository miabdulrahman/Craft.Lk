import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'pkffijen';
const apiKey = process.env.CLOUDINARY_API_KEY || '552223562897121';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '536iKLzTTfdiE8FYUxrTrioKf_g';

cloudinary.config({
  cloud_name: cloudName.trim(),
  api_key: apiKey.trim(),
  api_secret: apiSecret.trim(),
  secure: true
});

/**
 * Uploads an image buffer directly to Cloudinary and converts it to WebP format.
 * Returns the secure Cloudinary WebP URL to be stored directly in MongoDB.
 * 
 * @param {Buffer} buffer - File buffer from memoryStorage
 * @param {string} mimetype - Original MIME type
 * @param {string} folder - Target Cloudinary folder (e.g. craftlk/products, craftlk/shops)
 * @returns {Promise<{secure_url: string, public_id: string, format: string, provider: string}>}
 */
export const uploadToCloudinary = async (buffer, mimetype = 'image/jpeg', folder = 'craftlk/products') => {
  const base64Data = buffer.toString('base64');
  const dataUri = `data:${mimetype};base64,${base64Data}`;

  // Direct Cloudinary upload with WebP conversion
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    format: 'webp',
    resource_type: 'image',
    transformation: [
      { quality: 'auto:good' }
    ]
  });

  if (!result || !result.secure_url) {
    throw new Error('Cloudinary upload did not return a valid secure URL.');
  }

  // Ensure WebP format in the URL
  let webpUrl = result.secure_url;
  if (!webpUrl.endsWith('.webp')) {
    webpUrl = webpUrl.replace(/\.[a-zA-Z0-9]+$/, '.webp');
  }

  return {
    secure_url: webpUrl,
    public_id: result.public_id,
    format: 'webp',
    provider: 'cloudinary'
  };
};

export default cloudinary;
