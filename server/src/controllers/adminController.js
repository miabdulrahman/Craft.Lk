import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await Shop.countDocuments({ approvalStatus: 'approved' });
    const pendingSellers = await Shop.countDocuments({ approvalStatus: 'pending' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total marketplace gross merchandise value (revenue)
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Recent seller applications
    const recentSellers = await Shop.find()
      .populate('owner', 'name email createdAt')
      .sort({ createdAt: -1 })
      .limit(6);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .populate('shop', 'shopName')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        pendingSellers,
        totalProducts,
        totalOrders,
        totalRevenue
      },
      recentSellers,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { status, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (user.email === 'admin@craftlk.com' && status === 'suspended') {
      return res.status(400).json({
        success: false,
        message: 'Cannot suspend primary administrator account.'
      });
    }

    if (status) user.status = status;
    if (role) user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User status updated successfully.',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerApplications = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) {
      query.approvalStatus = status;
    }

    const applications = await Shop.find(query)
      .populate('owner', 'name email phone avatar createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

export const approveSeller = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop application not found.'
      });
    }

    shop.approvalStatus = 'approved';
    shop.rejectionReason = '';
    await shop.save();

    // Ensure the owner user has role 'seller'
    await User.findByIdAndUpdate(shop.owner, { role: 'seller' });

    res.status(200).json({
      success: true,
      message: `Shop "${shop.shopName}" has been approved! The artisan can now publish products.`,
      shop
    });
  } catch (error) {
    next(error);
  }
};

export const rejectSeller = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop application not found.'
      });
    }

    shop.approvalStatus = 'rejected';
    shop.rejectionReason = reason || 'Application did not meet seller criteria';
    await shop.save();

    res.status(200).json({
      success: true,
      message: `Shop application for "${shop.shopName}" has been rejected.`,
      shop
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone')
      .populate('shop', 'shopName district phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

export const moderateProduct = async (req, res, next) => {
  try {
    const { isActive, isFeatured } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    if (isActive !== undefined) product.isActive = Boolean(isActive);
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product listing moderated successfully.',
      product
    });
  } catch (error) {
    next(error);
  }
};
