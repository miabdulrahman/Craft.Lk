import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters']
    },
    slug: {
      type: String,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price in LKR'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please assign a category']
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: [true, 'Please assign a shop/seller']
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A product must have at least one image'
      },
      default: ['/images/products/wooden_elephant.jpg']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 1
    },
    badges: {
      type: [String],
      default: ['Handmade', 'Eco Friendly', 'Local Seller']
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 1
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

// Indexes for high performance search, filter and sort
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ seller: 1 });

export default mongoose.model('Product', productSchema);
