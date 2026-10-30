import Shop from '../models/Shop.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const applySeller = async (req, res, next) => {
  try {
    const { shopName, description, phone, district, city, craftCategories } = req.body;

    const existingShop = await Shop.findOne({ owner: req.user._id });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: `You already have a shop application with status: ${existingShop.approvalStatus}.`
      });
    }

    const nameCheck = await Shop.findOne({ shopName: shopName.trim() });
    if (nameCheck) {
      return res.status(400).json({
        success: false,
        message: 'A shop with this name is already registered. Please choose another name.'
      });
    }

    // Update user role to seller
    await User.findByIdAndUpdate(req.user._id, { role: 'seller' });

    const shop = await Shop.create({
      owner: req.user._id,
      shopName: shopName.trim(),
      description,
      phone: phone || req.user.phone,
      district: district || 'Colombo',
      city: city || 'Colombo',
      craftCategories: craftCategories || [],
      approvalStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Seller application submitted successfully! An administrator will review your shop.',
      shop
    });
  } catch (error) {
    next(error);
  }
};

export const getMyShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'No shop associated with this account.'
      });
    }

    // Derive real live metrics
    const productCount = await Product.countDocuments({ seller: shop._id });
    const orderCount = await Order.countDocuments({ shop: shop._id });

    // Calculate total sales from delivered or non-cancelled orders
    const salesAggregation = await Order.aggregate([
      { $match: { shop: shop._id, orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$subtotal' } } }
    ]);
    const totalSales = salesAggregation[0]?.totalSales || 0;

    res.status(200).json({
      success: true,
      shop,
      metrics: {
        productCount,
        orderCount,
        totalSales
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found.'
      });
    }

    const { shopName, description, phone, district, city, craftCategories, logo, banner } = req.body;

    if (shopName && shopName.trim() !== shop.shopName) {
      const nameCheck = await Shop.findOne({
        shopName: shopName.trim(),
        _id: { $ne: shop._id }
      });
      if (nameCheck) {
        return res.status(400).json({
          success: false,
          message: 'Another shop with this name already exists.'
        });
      }
      shop.shopName = shopName.trim();
    }

    if (description) shop.description = description;
    if (phone) shop.phone = phone;
    if (district) shop.district = district;
    if (city) shop.city = city;
    if (craftCategories) shop.craftCategories = craftCategories;
    if (logo) shop.logo = logo;
    if (banner) shop.banner = banner;

    await shop.save();

    res.status(200).json({
      success: true,
      message: 'Shop profile updated successfully!',
      shop
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicShops = async (req, res, next) => {
  try {
    const shops = await Shop.find({ approvalStatus: 'approved', isActive: true })
      .populate('owner', 'name email avatar')
      .sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shops.length,
      shops
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicShopById = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner', 'name email');
    if (!shop || shop.approvalStatus !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'Artisan shop not found or not approved.'
      });
    }

    const products = await Product.find({
      seller: shop._id,
      isActive: true
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      shop,
      products
    });
  } catch (error) {
    next(error);
  }
};
