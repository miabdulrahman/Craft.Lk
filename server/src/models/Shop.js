import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    shopName: {
      type: String,
      required: [true, 'Please provide a shop name'],
      trim: true,
      unique: true,
      maxlength: [100, 'Shop name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a shop description'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    logo: {
      type: String,
      default: '/images/default-artisan.png'
    },
    banner: {
      type: String,
      default: '/images/shop_banner.jpg'
    },
    phone: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'Please specify the Sri Lankan district'],
      default: 'Colombo'
    },
    city: {
      type: String,
      required: [true, 'Please specify city or town'],
      trim: true
    },
    craftCategories: [
      {
        type: String,
        trim: true
      }
    ],
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Pre-save to auto-generate slug
shopSchema.pre('save', function (next) {
  if (this.isModified('shopName') || !this.slug) {
    this.slug = this.shopName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

export default mongoose.model('Shop', shopSchema);
