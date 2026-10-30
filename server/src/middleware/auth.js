import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Shop from '../models/Shop.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check cookie first, then Authorization header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'craftlk_academic_jwt_secret_key_2026_seusl_handicrafts'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role || 'guest'}' does not have permission to access this resource.`
      });
    }
    next();
  };
};

export const requireApprovedSeller = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (req.user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to registered sellers only.'
      });
    }

    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'No shop application found for your account. Please submit an application.'
      });
    }

    if (shop.approvalStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        approvalStatus: shop.approvalStatus,
        message: `Your shop application is currently ${shop.approvalStatus}. You cannot publish products or process orders until approved by an administrator.`
      });
    }

    req.shop = shop;
    next();
  } catch (error) {
    next(error);
  }
};
