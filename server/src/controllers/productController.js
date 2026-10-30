import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Shop from '../models/Shop.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      seller,
      featured,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true };

    // Search keyword
    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } }
      ];
    }

    // Category filter (supports either ObjectId or category slug)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        }
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Seller shop filter
    if (seller) {
      query.seller = seller;
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sort order
    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortObj = { price: 1 };
    } else if (sort === 'price-desc') {
      sortObj = { price: -1 };
    } else if (sort === 'popularity') {
      sortObj = { rating: -1, reviewCount: -1 };
    } else if (sort === 'newest') {
      sortObj = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug icon')
      .populate('seller', 'shopName slug logo rating district city')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      products
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id)
        .populate('category', 'name slug icon')
        .populate('seller', 'shopName slug logo rating district city description');
    } else {
      product = await Product.findOne({ slug: id })
        .populate('category', 'name slug icon')
        .populate('seller', 'shopName slug logo rating district city description');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Handicraft product not found.'
      });
    }

    // Fetch up to 4 related products in the same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true
    })
      .populate('category', 'name slug')
      .populate('seller', 'shopName district')
      .limit(4);

    res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, images, badges } = req.body;

    // Validate category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category selected.'
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description,
      price: Number(price),
      category,
      seller: req.shop._id, // Enforce logged in seller's shop ID
      stock: Number(stock),
      images: images && images.length > 0 ? images : ['/images/products/wooden_elephant.jpg'],
      badges: badges || ['Handmade', 'Eco Friendly', 'Local Seller']
    });

    res.status(201).json({
      success: true,
      message: 'Product created and listed successfully!',
      product
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Role-based ownership check
    if (req.user.role !== 'admin') {
      const shop = await Shop.findOne({ owner: req.user._id });
      if (!shop || product.seller.toString() !== shop._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only edit your own products.'
        });
      }
    }

    const { name, description, price, category, stock, images, badges, isActive } = req.body;

    if (name) product.name = name.trim();
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category) {
      const catExists = await Category.findById(category);
      if (!catExists) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
      }
      product.category = category;
    }
    if (stock !== undefined) product.stock = Number(stock);
    if (images && images.length > 0) product.images = images;
    if (badges) product.badges = badges;
    if (isActive !== undefined) product.isActive = Boolean(isActive);

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      product
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Ownership check
    if (req.user.role !== 'admin') {
      const shop = await Shop.findOne({ owner: req.user._id });
      if (!shop || product.seller.toString() !== shop._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only delete your own products.'
        });
      }
    }

    await Product.findByIdAndDelete(product._id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerProducts = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found for this seller.'
      });
    }

    const products = await Product.find({ seller: shop._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};
